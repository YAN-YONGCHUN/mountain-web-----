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
        if (method === 'GET' && path === '/api/partners') {
            let partners = getData('partners');
            
            const status = searchParams.get('status');
            const page = parseInt(searchParams.get('page')) || 1;
            const limit = parseInt(searchParams.get('limit')) || 10;

            if (status && status !== 'all') {
                partners = partners.filter(p => p.status === status);
            }

            const total = partners.length;
            const start = (page - 1) * limit;
            const paginatedPartners = partners.slice(start, start + limit);

            return sendSuccess(res, {
                partners: paginatedPartners,
                pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
            });
        }

        if (method === 'POST' && path === '/api/partners') {
            const auth = authMiddleware(req);
            if (!auth.valid) {
                return sendError(res, '请先登录', 401);
            }

            const body = await parseBody(req);
            const { route, date, total, difficulty, description } = body;

            if (!route || !date) {
                return sendError(res, '请填写完整信息');
            }

            const newPartner = addItem('partners', {
                name: auth.user.name,
                userId: auth.user.id,
                route,
                date,
                total: parseInt(total) || 2,
                need: (parseInt(total) || 2) - 1,
                difficulty: difficulty || '中等',
                description: description || '',
                createTime: new Date().toLocaleDateString(),
                status: 'recruiting'
            });

            return sendSuccess(res, { partner: newPartner }, '发布成功');
        }

        if (method === 'PUT' && path.match(/^\/api\/partners\/\d+$/)) {
            const id = path.split('/').pop();
            const body = await parseBody(req);
            
            const partner = findItem('partners', 'id', parseInt(id));
            if (!partner) {
                return sendError(res, '招募信息不存在', 404);
            }

            const updated = updateItem('partners', parseInt(id), body);

            return sendSuccess(res, { partner: updated }, '更新成功');
        }

        if (method === 'DELETE' && path.match(/^\/api\/partners\/\d+$/)) {
            const auth = authMiddleware(req);
            if (!auth.valid || !auth.user.isAdmin) {
                return sendError(res, '无权限操作', 403);
            }

            const id = path.split('/').pop();
            const deleted = deleteItem('partners', parseInt(id));
            
            if (!deleted) {
                return sendError(res, '招募信息不存在', 404);
            }

            return sendSuccess(res, {}, '删除成功');
        }

        return sendError(res, '未知的搭子请求', 404);

    } catch (error) {
        console.error('Partners API Error:', error);
        return sendError(res, '服务器错误', 500);
    }
};
