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
        if (method === 'GET' && path === '/api/products') {
            let products = getData('products');
            
            const category = searchParams.get('category');
            const page = parseInt(searchParams.get('page')) || 1;
            const limit = parseInt(searchParams.get('limit')) || 10;

            if (category && category !== 'all') {
                products = products.filter(p => p.category === category);
            }

            const total = products.length;
            const start = (page - 1) * limit;
            const paginatedProducts = products.slice(start, start + limit);

            return sendSuccess(res, {
                products: paginatedProducts,
                pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
            });
        }

        if (method === 'GET' && path.match(/^\/api\/products\/\d+$/)) {
            const id = path.split('/').pop();
            const product = findItem('products', 'id', parseInt(id));
            
            if (!product) {
                return sendError(res, '商品不存在', 404);
            }

            return sendSuccess(res, { product });
        }

        if (method === 'POST' && path === '/api/products') {
            const auth = authMiddleware(req);
            if (!auth.valid || !auth.user.isAdmin) {
                return sendError(res, '无权限操作', 403);
            }

            const body = await parseBody(req);
            const { name, category, price, stock, badge, desc } = body;

            if (!name || !price) {
                return sendError(res, '请填写完整信息');
            }

            const newProduct = addItem('products', {
                name,
                category: category || '周边',
                price: parseFloat(price),
                stock: parseInt(stock) || 0,
                sales: 0,
                badge: badge || '',
                desc: desc || '',
                status: 'active'
            });

            return sendSuccess(res, { product: newProduct }, '添加成功');
        }

        if (method === 'PUT' && path.match(/^\/api\/products\/\d+$/)) {
            const auth = authMiddleware(req);
            if (!auth.valid || !auth.user.isAdmin) {
                return sendError(res, '无权限操作', 403);
            }

            const id = path.split('/').pop();
            const body = await parseBody(req);
            
            const updated = updateItem('products', parseInt(id), body);
            
            if (!updated) {
                return sendError(res, '商品不存在', 404);
            }

            return sendSuccess(res, { product: updated }, '更新成功');
        }

        if (method === 'DELETE' && path.match(/^\/api\/products\/\d+$/)) {
            const auth = authMiddleware(req);
            if (!auth.valid || !auth.user.isAdmin) {
                return sendError(res, '无权限操作', 403);
            }

            const id = path.split('/').pop();
            const deleted = deleteItem('products', parseInt(id));
            
            if (!deleted) {
                return sendError(res, '商品不存在', 404);
            }

            return sendSuccess(res, {}, '删除成功');
        }

        return sendError(res, '未知的商品请求', 404);

    } catch (error) {
        console.error('Products API Error:', error);
        return sendError(res, '服务器错误', 500);
    }
};
