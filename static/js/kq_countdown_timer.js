/**
 * 秒杀倒计时定时器
 * @param {Object} options 配置项
 *   @param {Number|String|Date} options.endTime 结束时间(毫秒时间戳/日期字符串/Date对象)
 *   @param {Function} options.onUpdate 时间更新回调
 *   @param {Function} [options.onEnd] 倒计时结束回调
 *   @param {Boolean} [options.autoStart=true] 是否自动开始
 *   @param {Number} [options.updateInterval=1000] 更新时间间隔(ms)，默认1秒
 *   @param {Boolean} [options.forceUpdate=false] 是否强制每次间隔都更新
 */
function KQCountdownTimer(options) {
    // 参数校验
    if (!options || typeof options.onUpdate !== 'function') {
        throw new TypeError('KQCountdownTimer: 必须提供onUpdate回调函数');
    }
    if (!options.endTime) {
        throw new Error('KQCountdownTimer: 必须提供endTime');
    }

    // 合并配置
    this._config = {
        updateInterval: 1000,
        autoStart: true,
        forceUpdate: false,
    };
    for (var key in options) {
        if (options.hasOwnProperty(key)) {
            this._config[key] = options[key];
        }
    }

    // 初始化状态
    this._state = {
        endTime: this._parseTime(options.endTime),
        isRunning: false,
        timerId: null,
        lastSeconds: -1,
        startedAt: 0,
        expectedNextUpdate: 0
    };

    // 自动开始
    if (this._config.autoStart) {
        this.start();
    }
}

// 静态方法：毫秒时间戳的格式化
KQCountdownTimer.formatTime = function (ms) {
    if (ms < 0) ms = 0;
    var sec = Math.round(ms / 1000);
    return {
        days: Math.floor(sec / 86400),
        hours: Math.floor((sec % 86400) / 3600),
        minutes: Math.floor((sec % 3600) / 60),
        seconds: sec % 60,
        totalMs: ms,
        totalSeconds: sec,
        isEnd: ms <= 0
    };
};

// 静态方法：补零
KQCountdownTimer.paddingZero = function (num) {
    return num < 10 ? '0' + num : num.toString();
};

// 原型方法
KQCountdownTimer.prototype = {
    constructor: KQCountdownTimer,

    // 解析时间输入
    _parseTime: function (time) {
        // 时间戳
        if (typeof time === 'number') {
            return new Date(time);
        }
        if (typeof time === 'string' && /^\d+$/.test(time)) {
            return new Date(parseInt(time, 10));
        }
        // 日期字符串或Date对象
        var date = new Date(time);
        if (isNaN(date.getTime())) {
            throw new Error('KQCountdownTimer: 无效的时间格式');
        }
        return date;
    },

    // 开始倒计时
    start: function () {
        if (this._state.isRunning) return;

        var now = Date.now();
        this._state.isRunning = true;
        this._state.startedAt = now;
        this._state.expectedNextUpdate = now + this._config.updateInterval;
        this._state.lastSeconds = -1; // 重置秒数记录
        this._tick();
        this.forceUpdate();
    },

    // 暂停倒计时
    pause: function () {
        if (!this._state.isRunning) return;

        this._state.isRunning = false;
        this._cancelFrame();
    },

    // 重置倒计时
    reset: function (newEndTime) {
        this.pause();
        this._state.endTime = this._parseTime(newEndTime);
        this.start();
    },

    // 销毁定时器
    destroy: function () {
        this.pause();
        this._config.onUpdate = null;
        this._config.onEnd = null;
    },

    // 强制立即触发更新
    forceUpdate: function () {
        if (!this._state.isRunning) return;
        this._triggerUpdate(true);
    },

    // 获取剩余时间(ms)
    getRemainingTime: function () {
        return this._getRemaining();
    },

    // 获取倒计时状态
    getState: function () {
        return {
            isRunning: this._state.isRunning,
            endTime: this._state.endTime,
            startedAt: this._state.startedAt
        };
    },

    // 内部方法：获取剩余时间
    _getRemaining: function () {
        var remaining = this._state.endTime.getTime() - Date.now();
        return remaining > 0 ? remaining : 0;
    },

    // 内部方法：取消动画帧
    _cancelFrame: function () {
        if (this._state.timerId) {
            window.cancelAnimationFrame(this._state.timerId);
            this._state.timerId = null;
        }
    },

    // 内部方法：触发更新
    _triggerUpdate: function (force) {
        var remaining = this._getRemaining();
        var formatted = KQCountdownTimer.formatTime(remaining);

        // 结束检测
        if (remaining <= 0) {
            this._config.onUpdate(formatted);
            this.pause();
            if (typeof this._config.onEnd === 'function') {
                this._config.onEnd();
            }
            return;
        }

        // 触发回调
        if (force || this._shouldUpdate(formatted.totalSeconds)) {
            this._config.onUpdate(formatted);
        }
    },

    // 内部方法：判断是否需要更新
    _shouldUpdate: function (currentSeconds) {
        var shouldUpdate = this._config.forceUpdate || currentSeconds !== this._state.lastSeconds;
        this._state.lastSeconds = currentSeconds;
        return shouldUpdate;
    },

    // 核心定时器逻辑
    _tick: function () {
        if (!this._state.isRunning) return;

        var now = Date.now();
        // 使用预期时间点而非时间差来提高精度
        if (now >= this._state.expectedNextUpdate) {
            this._state.expectedNextUpdate = now + this._config.updateInterval;
            this._triggerUpdate();
        }

        // 继续下一帧
        this._state.timerId = window.requestAnimationFrame(this._tick.bind(this));
    }
};

(function () {
    if (!window.requestAnimationFrame) {
        var vendors = ['ms', 'moz', 'webkit', 'o'];
        for (var i = 0; i < vendors.length; i++) {
            var vendor = vendors[i];
            window.requestAnimationFrame = window[vendor + 'RequestAnimationFrame'];
            window.cancelAnimationFrame =
                window[vendor + 'CancelAnimationFrame'] ||
                window[vendor + 'CancelRequestAnimationFrame'];
            if (window.requestAnimationFrame) break;
        }

        if (!window.requestAnimationFrame) {
            var lastTime = 0;
            window.requestAnimationFrame = function (callback) {
                var currTime = Date.now();
                var timeToCall = Math.max(0, 16 - (currTime - lastTime));
                var id = setTimeout(function () {
                    callback(currTime + timeToCall);
                }, timeToCall);
                lastTime = currTime + timeToCall;
                return id;
            };

            window.cancelAnimationFrame = function (id) {
                clearTimeout(id);
            };
        }
    }
})();