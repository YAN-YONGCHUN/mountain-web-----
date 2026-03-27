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
        if (method === 'GET' && path === '/api/rentals') {
            const auth = authMiddleware(req);
            if (!auth.valid) {
                return sendError(res, '请先登录', 401);
            }

            let rentals = getData('rentals');
            
            const status = searchParams.get('status');
            const page = parseInt(searchParams.get('page')) || 1;
            const limit = parseInt(searchParams.get('limit')) || 10;

            if (status && status !== 'all') {
                rentals = rentals.filter(r => r.status === status);
            }

            const total = rentals.length;
            const start = (page - 1) * limit;
            const paginatedRentals = rentals.slice(start, start + limit);

            return sendSuccess(res, {
                rentals: paginatedRentals,
                pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
            });
        }

        if (method === 'POST' && path === '/api/rentals') {
            const auth = authMiddleware(req);
            if (!auth.valid) {
                return sendError(res, '请先登录', 401);
            }

            const body = await parseBody(req);
            const { mountain, code, duration, cost } = body;

            if (!mountain || !code) {
                return sendError(res, '请填写完整信息');
            }

            const newRental = addItem('rentals', {
                id: Date.now(),
                userId: auth.user.id,
                mountain,
                code,
                time: new Date().toLocaleString(),
                duration: duration || '进行中',
                cost: parseFloat(cost) || 0,
                status: 'active'
            });

            return sendSuccess(res, { rental: newRental }, '租借成功');
        }

        if (method === 'PUT' && path.match(/^\/api\/rentals\/\d+$/)) {
            const auth = authMiddleware(req);
            if (!auth.valid) {
                return sendError(res, '请先登录', 401);
            }

            const id = path.split('/').pop();
            const body = await parseBody(req);
            
            const updated = updateItem('rentals', parseInt(id), { ...body, status: 'done' });
            
            if (!updated) {
                return sendError(res, '租借记录不存在', 404);
            }

            return sendSuccess(res, { rental: updated }, '归还成功');
        }

        return sendError(res, '未知的租借请求', 404);

    } catch (error) {
        console.error('Rentals API Error:', error);
        return sendError(res, '服务器错误', 500);
    }
};
