const { handleOptions, parseBody, sendSuccess, sendError } = require('../lib/utils');
const { getData, addItem, updateItem, deleteItem, findItem } = require('../lib/db');
const { authMiddleware } = require('../lib/auth');

module.exports = async (req, res) => {
    if (handleOptions(req, res)) return;

    const { method } = req;
    const path = req.url.split('?')[0];
    const url = new URL(req.url, `http://${req.headers.host}`);
    const searchParams = url.searchParams;

    try {
        if (method === 'GET' && path === '/api/orders') {
            const auth = authMiddleware(req);
            if (!auth.valid) {
                return sendError(res, '请先登录', 401);
            }

            let orders = getData('orders');
            
            const status = searchParams.get('status');
            const page = parseInt(searchParams.get('page')) || 1;
            const limit = parseInt(searchParams.get('limit')) || 10;

            if (status && status !== 'all') {
                orders = orders.filter(o => o.status === status);
            }

            if (!auth.user.isAdmin) {
                orders = orders.filter(o => o.userId === auth.user.id);
            }

            const total = orders.length;
            const start = (page - 1) * limit;
            const paginatedOrders = orders.slice(start, start + limit);

            return sendSuccess(res, {
                orders: paginatedOrders,
                pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
            });
        }

        if (method === 'POST' && path === '/api/orders') {
            const auth = authMiddleware(req);
            if (!auth.valid) {
                return sendError(res, '请先登录', 401);
            }

            const body = await parseBody(req);
            const { product, amount } = body;

            if (!product || !amount) {
                return sendError(res, '请填写完整信息');
            }

            const newOrder = addItem('orders', {
                id: 'ORD' + Date.now().toString().slice(-6),
                userId: auth.user.id,
                product,
                amount: parseFloat(amount),
                time: new Date().toLocaleString(),
                status: 'pending'
            });

            return sendSuccess(res, { order: newOrder }, '下单成功');
        }

        if (method === 'PUT' && path.match(/^\/api\/orders\/[^/]+$/)) {
            const auth = authMiddleware(req);
            if (!auth.valid || !auth.user.isAdmin) {
                return sendError(res, '无权限操作', 403);
            }

            const orderId = path.split('/').pop();
            const body = await parseBody(req);
            
            const updated = updateItem('orders', orderId, body);
            
            if (!updated) {
                return sendError(res, '订单不存在', 404);
            }

            return sendSuccess(res, { order: updated }, '更新成功');
        }

        return sendError(res, '未知的订单请求', 404);

    } catch (error) {
        console.error('Orders API Error:', error);
        return sendError(res, '服务器错误', 500);
    }
};
