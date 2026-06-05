(function (name, context, definition) {
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = definition();
    }
    else if (typeof define === 'function' && define.amd) {
        define(definition);
    }
    else {
        context[name] = definition();
    }
})('CTTool', this, function () {
    'use strict';

    function _showToast(msg) {
        setTimeout(function () {
            // 检查是否已存在 toast 容器，不存在则创建
            var toastWrap = document.getElementsByClassName('toast-wrap')[0];
            if (!toastWrap) {
                toastWrap = document.createElement('div');
                toastWrap.className = 'toast-wrap';
                var toastMsg = document.createElement('span');
                toastMsg.className = 'toast-msg';
                toastWrap.appendChild(toastMsg);
                document.body.appendChild(toastWrap);
            } else {
                // 如果元素被隐藏，需要重置显示状态
                toastWrap.style.display = '';
                toastWrap.style.opacity = '';
            }
            
            var toastMsg = toastWrap.getElementsByClassName('toast-msg')[0];
            toastMsg.innerHTML = msg;
            toastWrap.className = toastWrap.className.replace('toastAnimate', '');
            
            // 强制重绘以重新触发动画
            void toastWrap.offsetWidth;
            
            setTimeout(function () {
                toastWrap.className = toastWrap.className + ' toastAnimate';
            }, 10);
            
            // 监听动画结束，动画完成后隐藏元素
            toastWrap.addEventListener('animationend', function handler() {
                toastWrap.removeEventListener('animationend', handler);
                toastWrap.style.display = 'none';
            });
        }, 500);
    }

    /** callback: 0-失败、1-成功、2-异常 */
    function _copyToClipboard(text, callback) {
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(text).then(() => {
                callback(1);
            }).catch(() => {
                callback(0);
            });
        } else {
            if (typeof document.execCommand == 'function') {
                const element = document.createElement("textarea");
                element.value = text;
                element.setAttribute("readonly", "readonly");
                document.body.appendChild(element);
                element.select();
                let success = document.execCommand('copy');
                document.body.removeChild(element);
                callback(success ? 1 : 0);
            } else {
                callback(0);
            }
        }
    }

    function _randomUUID() {
        if (typeof crypto === 'object') {
            if (typeof crypto.randomUUID === 'function') {
                return crypto.randomUUID();
            }
            if (typeof crypto.getRandomValues === 'function' && typeof Uint8Array === 'function') {
                const callback = (c) => {
                    const num = Number(c);
                    return (num ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (num / 4)))).toString(16);
                };
                return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, callback);
            }
        }

        let timestamp = new Date().getTime();
        let perforNow = (typeof performance !== 'undefined' && performance.now && performance.now() * 1000) || 0;
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            let random = Math.random() * 16;
            if (timestamp > 0) {
                random = (timestamp + random) % 16 | 0;
                timestamp = Math.floor(timestamp / 16);
            } else {
                random = (perforNow + random) % 16 | 0;
                perforNow = Math.floor(perforNow / 16);
            }
            return (c === 'x' ? random : (random & 0x3) | 0x8).toString(16);
        });
    };

    return {
        VERSION: '1.0.0',
        showToast: _showToast,
        copyToClipboard: _copyToClipboard,
        randomUUID: _randomUUID,
    };
});