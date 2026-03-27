function setCorsHeaders(res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

function sendResponse(res, status, data) {
    setCorsHeaders(res);
    res.status(status).json(data);
}

function sendSuccess(res, data, message = '操作成功') {
    sendResponse(res, 200, { success: true, message, data });
}

function sendError(res, message = '操作失败', status = 400) {
    sendResponse(res, status, { success: false, message });
}

function handleOptions(req, res) {
    if (req.method === 'OPTIONS') {
        setCorsHeaders(res);
        res.status(200).end();
        return true;
    }
    return false;
}

function parseBody(req) {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                resolve(body ? JSON.parse(body) : {});
            } catch (e) {
                resolve({});
            }
        });
        req.on('error', reject);
    });
}

module.exports = {
    setCorsHeaders,
    sendResponse,
    sendSuccess,
    sendError,
    handleOptions,
    parseBody
};
