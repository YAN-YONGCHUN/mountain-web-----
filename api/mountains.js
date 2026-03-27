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
        if (method === 'GET' && path === '/api/mountains') {
            let mountains = getData('mountains');
            
            const keyword = searchParams.get('keyword');
            const difficulty = searchParams.get('difficulty');
            const page = parseInt(searchParams.get('page')) || 1;
            const limit = parseInt(searchParams.get('limit')) || 10;

            if (keyword) {
                mountains = mountains.filter(m => 
                    m.name.includes(keyword) || m.location.includes(keyword)
                );
            }

            if (difficulty) {
                mountains = mountains.filter(m => m.difficulty === difficulty);
            }

            const total = mountains.length;
            const start = (page - 1) * limit;
            const paginatedMountains = mountains.slice(start, start + limit);

            return sendSuccess(res, {
                mountains: paginatedMountains,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit)
                }
            });
        }

        if (method === 'GET' && path.match(/^\/api\/mountains\/\d+$/)) {
            const id = path.split('/').pop();
            const mountain = findItem('mountains', 'id', parseInt(id));
            
            if (!mountain) {
                return sendError(res, '山峰不存在', 404);
            }

            mountain.views = (mountain.views || 0) + 1;
            updateItem('mountains', id, { views: mountain.views });

            return sendSuccess(res, { mountain });
        }

        if (method === 'POST' && path === '/api/mountains') {
            const auth = authMiddleware(req);
            if (!auth.valid || !auth.user.isAdmin) {
                return sendError(res, '无权限操作', 403);
            }

            const body = await parseBody(req);
            const { name, location, altitude, difficulty, rating, description, image, badges } = body;

            if (!name || !location || !altitude) {
                return sendError(res, '请填写完整信息');
            }

            const newMountain = addItem('mountains', {
                name,
                location,
                altitude: parseInt(altitude),
                difficulty: difficulty || '中等',
                rating: parseFloat(rating) || 4.5,
                description: description || '',
                image: image || '',
                badges: badges || [],
                views: 0,
                isNew: true
            });

            return sendSuccess(res, { mountain: newMountain }, '添加成功');
        }

        if (method === 'PUT' && path.match(/^\/api\/mountains\/\d+$/)) {
            const auth = authMiddleware(req);
            if (!auth.valid || !auth.user.isAdmin) {
                return sendError(res, '无权限操作', 403);
            }

            const id = path.split('/').pop();
            const body = await parseBody(req);
            
            const updated = updateItem('mountains', parseInt(id), body);
            
            if (!updated) {
                return sendError(res, '山峰不存在', 404);
            }

            return sendSuccess(res, { mountain: updated }, '更新成功');
        }

        if (method === 'DELETE' && path.match(/^\/api\/mountains\/\d+$/)) {
            const auth = authMiddleware(req);
            if (!auth.valid || !auth.user.isAdmin) {
                return sendError(res, '无权限操作', 403);
            }

            const id = path.split('/').pop();
            const deleted = deleteItem('mountains', parseInt(id));
            
            if (!deleted) {
                return sendError(res, '山峰不存在', 404);
            }

            return sendSuccess(res, {}, '删除成功');
        }

        return sendError(res, '未知的山峰请求', 404);

    } catch (error) {
        console.error('Mountains API Error:', error);
        return sendError(res, '服务器错误', 500);
    }
};
