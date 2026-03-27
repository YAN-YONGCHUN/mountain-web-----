const { handleOptions, parseBody, sendSuccess, sendError } = require('../lib/utils');
const { getData, findItem, addItem, updateItem, deleteItem } = require('../lib/db');
const { authMiddleware } = require('../lib/auth');

module.exports = async (req, res) => {
    if (handleOptions(req, res)) return;

    const { method } = req;
    const path = req.url.split('?')[0];
    const url = new URL(req.url, `http://${req.headers.host}`);
    const searchParams = url.searchParams;

    try {
        if (method === 'GET' && path === '/api/users') {
            const auth = authMiddleware(req);
            if (!auth.valid || !auth.user.isAdmin) {
                return sendError(res, '无权限操作', 403);
            }

            let users = getData('users');
            
            const keyword = searchParams.get('keyword');
            const status = searchParams.get('status');
            const page = parseInt(searchParams.get('page')) || 1;
            const limit = parseInt(searchParams.get('limit')) || 10;

            if (keyword) {
                users = users.filter(u => 
                    (u.name && u.name.includes(keyword)) || 
                    (u.phone && u.phone.includes(keyword))
                );
            }

            if (status && status !== 'all') {
                users = users.filter(u => u.status === status);
            }

            const total = users.length;
            const start = (page - 1) * limit;
            const paginatedUsers = users.slice(start, start + limit).map(u => {
                const { password, ...userWithoutPassword } = u;
                return userWithoutPassword;
            });

            return sendSuccess(res, {
                users: paginatedUsers,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit)
                }
            });
        }

        if (method === 'GET' && path.match(/^\/api\/users\/[^/]+$/)) {
            const phone = path.split('/').pop();
            const user = findItem('users', 'phone', phone);
            
            if (!user) {
                return sendError(res, '用户不存在', 404);
            }

            const { password, ...userWithoutPassword } = user;
            return sendSuccess(res, { user: userWithoutPassword });
        }

        if (method === 'POST' && path === '/api/users') {
            const auth = authMiddleware(req);
            if (!auth.valid || !auth.user.isAdmin) {
                return sendError(res, '无权限操作', 403);
            }

            const body = await parseBody(req);
            const { name, phone, email, password, status } = body;

            if (!name || !phone) {
                return sendError(res, '请填写完整信息');
            }

            if (findItem('users', 'phone', phone)) {
                return sendError(res, '该手机号已存在');
            }

            const newUser = addItem('users', {
                name,
                phone,
                email: email || `${phone}@example.com`,
                password: password || '123456',
                status: status || 'active',
                registerTime: new Date().toLocaleDateString(),
                climbCount: 0
            });

            const { password: pwd, ...userWithoutPassword } = newUser;
            return sendSuccess(res, { user: userWithoutPassword }, '添加成功');
        }

        if (method === 'PUT' && path.match(/^\/api\/users\/[^/]+$/)) {
            const auth = authMiddleware(req);
            if (!auth.valid || !auth.user.isAdmin) {
                return sendError(res, '无权限操作', 403);
            }

            const phone = path.split('/').pop();
            const body = await parseBody(req);
            
            const user = findItem('users', 'phone', phone);
            if (!user) {
                return sendError(res, '用户不存在', 404);
            }

            const updated = updateItem('users', user.id, body);
            const { password, ...userWithoutPassword } = updated;

            return sendSuccess(res, { user: userWithoutPassword }, '更新成功');
        }

        if (method === 'DELETE' && path.match(/^\/api\/users\/[^/]+$/)) {
            const auth = authMiddleware(req);
            if (!auth.valid || !auth.user.isAdmin) {
                return sendError(res, '无权限操作', 403);
            }

            const phone = path.split('/').pop();
            const user = findItem('users', 'phone', phone);
            
            if (!user) {
                return sendError(res, '用户不存在', 404);
            }

            deleteItem('users', user.id);
            return sendSuccess(res, {}, '删除成功');
        }

        return sendError(res, '未知的用户请求', 404);

    } catch (error) {
        console.error('Users API Error:', error);
        return sendError(res, '服务器错误', 500);
    }
};
