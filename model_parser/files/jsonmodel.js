var jsonModel = function() {
    var k = "",
    l = "",
    v = "",
    m = "",
    w = "",
    n = "",
    A = function(a, d) {
        var c = "";
        if (q(a)) {
            if (0 < a.length && 0 < a.length) {
                for (var e = a[0], f = a.length - 1; 0 <= f; f--) {
                    var b = a[f];
                    q(b) ? b.length > e.length && (e = b) : r(b) && Object.keys(b).length > Object.keys(e).length && (e = b)
                }
                c += A(e, d)
            }
        } else if (r(a)) for (e in a) {
            b = a[e];
            var h = p(e),
            g = B(e);
            q(b) ? (0 < b.length && (f = b[0]), "string" === typeof f ? c += "    var " + g + ": String!\r\n": "number" === typeof f || "boolean" === typeof f ? c += "    var " + g + ": Int = 0\r\n": "object" === typeof f && (h += "Item", c += "    var " + g + ": [" + g + "]!\r\n", b = G(h) + A(b, e) + "}\r\n", n = 0 < n.length ? n + "\r\n" + b: b)) : r(b) ? (b = G(p(g)) + A(b, e) + "}\r\n", n = 0 < n.length ? n + "\r\n" + b: b) : "string" === typeof b ? c += "    var " + g + ": String!\r\n": "number" === typeof b ? c = 0 <= b.toString().indexOf(".") ? c + ("    var " + g + ": CGFloat = 0.0\r\n") : c + ("    var " + g + ": Int = 0\r\n") : "boolean" === typeof b && (c += "    var " + g + ": Bool = false\r\n")
        } else alert("key = " + d);
        return c
    },
    B = function(a) {
        return a.replace(/\b[a-z]/g,
        function(a) {
            return a.toLowerCase()
        })
    },
    C = function() {
        n = w = m = v = l = k = ""
    },
    D = function() {
        var a = editor_json.getValue().trim();
        try {
            var d = jsonlint.parse(a);
            if (d) {
                document.getElementById("result-container").setAttribute("class", "shown");
                document.getElementById("result").innerHTML = "JSON is valid!";
                document.getElementById("result").setAttribute("class", "success");
                var c = JSON.stringify(d, null, "  ");
                editor_json.setValue(c);
                return ! 0
            }
        } catch(e) {
            return document.getElementById("result-container").setAttribute("class", "shown"),
            document.getElementById("result").innerHTML = e,
            document.getElementById("result").className = "error",
            !1
        }
    },
    E = function(a, d) {
        return "@property (nonatomic, assign) " + a + " " + d + ";\n"
    },
    F = function(a) {
        return "public static class " + a + "    {\r\n"
    },
    G = function(a) {
        return "class " + a + " : NSObject {\r\n"
    },
    H = function(a, d) {
        // OC
        C();
        0 == d.length && (d = "ModelName");
        var c = y(a, d);
        k = 0 < k.length ? k + "\r\n\r\n" + t(d, c) : t(d, c);
        l = 0 < l.length ? l + "\r\n\r\n" + u(d) : u(d);
        c = document.createElement("pre");
        c.setAttribute("id", "headCode");
        c.setAttribute("class", "model-result prettyprint lang-m");
        c.textContent = k;
        document.getElementById("precode").appendChild(c);
        c = document.createElement("pre");
        c.setAttribute("id", "implementCode");
        c.setAttribute("class", "model-result prettyprint lang-m");
        c.textContent = l;
        document.getElementById("precode").appendChild(c);
        prettyPrint()
    },
    I = function(a, d) {
        // JAVA
        C();
        0 == d.length && (d = "ModelName");
        var c = z(a, d);
        c = v = F(d) + c + "}\r\n";
        0 < m.length && (c = m + "\r\n" + v);
        var e = document.createElement("pre");
        e.setAttribute("id", "implementCode");
        e.setAttribute("class", "model-result prettyprint lang-java");
        e.textContent = c;
        document.getElementById("precode").appendChild(e);
        prettyPrint()
    },
    J = function(a, d) {
        // SWift
        C();
        0 == d.length && (d = "ModelName");
        var c = A(a, d);
        c = w = G(d) + c + "}\r\n";
        0 < n.length && (c = n + "\r\n" + w);
        var e = document.createElement("pre");
        e.setAttribute("id", "implementCode");
        e.setAttribute("class", "model-result prettyprint lang-swift");
        e.textContent = c;
        document.getElementById("precode").appendChild(e);
        prettyPrint()
    },
    K = function(a, d) {
        // Qt
        C();
        0 == d.length && (d = "ModelName");
        
        var c = qt_a(a, d);
        c = w = qt_b(d) + c + "};\r\n";
        0 < n.length && (c = n + "\r\n" + w);

        var e = document.createElement("pre");
        e.setAttribute("id", "implementCode");
        e.setAttribute("class", "model-result prettyprint lang-cpp");
        e.textContent = c;
        document.getElementById("precode").appendChild(e);

        prettyPrint()
    },
    p = function(a) {
        return a.replace(/\b[a-z]/g,
        function(a) {
            return a.toUpperCase()
        })
    },
    qt_a = function (json, clsName) {
        var c = "";
        if (json instanceof Object && Object.keys(json).length > 0) {
            var property = "";
            var set = "";
            var get = "";
            var private = "";

            for (var item in json) {
                var value = qt_typeName(json[item]);
                if (value.length > 0) {
                    property += qt_property(item, json[item]);
                    set += qt_set(item, json[item]);
                    get += qt_get(item, json[item]);
                    private += qt_private(item, json[item]);
                }
            }

            c = property + qt_init(clsName) + get + "\r\n" + set + "\r\n\r\nprivate:\r\n" + private;
        }
        return c;
    },
    qt_b = function (a) {
        return "class " + a + " : public CTBaseModel\r\n{\r\n    Q_OBJECT\r\n\r\n";
    },
    qt_property = function (key, value) {
        return "    Q_PROPERTY(" + qt_typeName(value) +  " " + key + " READ " + key + " WRITE " + qt_set_method_name(key) + ")\r\n";
    },
    qt_set = function (key, value) {
        return "    Q_INVOKABLE void " + qt_set_method_name(key) + "(" + qt_typeName(value) + " " + key + ") { m_" + key + " = " + key + "; }\r\n";
    },
    qt_get = function (key, value) {
        return "    Q_INVOKABLE " + qt_typeName(value) + " " + key + "() { return m_" + key + "; }\r\n";
    },
    qt_private = function (key, value) {
        return "    " + qt_typeName(value) + " m_" + key + ";\r\n";
    },
    qt_typeName = function (value) {
        if (typeof value == "string") {
            return "QString";
        }else if (typeof value == "number") {
            var str = value.toString();
            if (str.indexOf(".") != -1) {
                return "double";
            }else {
                return "int";
            }
        }else if (typeof value == "boolean") {
            return "bool";
        }else if (typeof value == "object") {
            return ""; // 数组、字典、其它自定义对象等
        }
        return "QString"
    },
    qt_set_method_name = function (key) {
        return "set" + p(key);
    },
    qt_init = function (clsName) {
        return "\r\npublic:\r\n    Q_INVOKABLE explicit " + p(clsName) + "(QObject *parent = nullptr);\r\n\r\n";
    },
    q = function(a) {
        return a instanceof Object ? a.constructor.prototype.hasOwnProperty("push") : !1
    },
    r = function(a) {
        return a instanceof Object ? !a.constructor.prototype.hasOwnProperty("push") : !1
    },
    t = function(a, d) {
        return "@interface " + a + " : NSObject\n\n" + d + "\n@end\n"
    },
    u = function(a) {
        return "@implementation " + a + "\n@end\n"
    },
    w = function(a, d) {
        var c = "";
        if (q(a)) {
            if (0 < a.length && 0 < a.length) {
                for (var e = a[0], f = a.length - 1; 0 <= f; f--) {
                    var b = a[f];
                    q(b) ? b.length > e.length && (e = b) : r(b) && Object.keys(b).length > Object.keys(e).length && (e = b)
                }
                c += w(e, d)
            }
        } else if (r(a)) 
            for (e in a) {
            b = a[e];
            var h = p(e);
            f = B(e);
            if (q(b)) {
                var g;
                0 < b.length && (g = b[0]);
                "string" === typeof g ? c += x("NSArray <NSString *>", f) : "number" === typeof g || "boolean" === typeof g ? c += x("NSArray <NSNumber *>", f) : "object" === typeof g && (h += "Item", c += x("NSArray <" + h + " *>", f), b = y(b, e), k = 0 < k.length ? k + "\r\n\r\n" + t(h, b) : t(h, b), l = 0 < l.length ? l + "\r\n\r\n" + u(h) : u(h))
            } else r(b) ? (b = y(b, e), c += x(h, f), k = 0 < k.length ? k + "\r\n\r\n" + t(h, b) : t(h, b), l = 0 < l.length ? l + "\r\n\r\n" + u(h) : u(h)) : "string" === typeof b ? c += "@property (nonatomic, copy) NSString *" + f + ";\n": "number" === typeof b ? c = 0 <= b.toString().indexOf(".") ? c + E("CGFloat", f) : c + E("NSInteger", f) : "boolean" === typeof b && (c += E("BOOL", f))
        } else alert("key = " + d);
        return c
    },
    x = function(a, d) {
        return "@property (nonatomic, strong) " + a + " *" + d + ";\n"
    },
    y = function(a, d) {
        var c = "";
        if (q(a)) {
            if (0 < a.length && 0 < a.length) {
                for (var e = a[0], f = a.length - 1; 0 <= f; f--) {
                    var b = a[f];
                    q(b) ? b.length > e.length && (e = b) : r(b) && Object.keys(b).length > Object.keys(e).length && (e = b)
                }
                c += y(e, d)
            }
        } else if (r(a)) for (e in a) {
            b = a[e];
            var h = p(e);
            f = B(e);
            if (q(b)) {
                var g;
                0 < b.length && (g = b[0]);
                "string" === typeof g ? c += x("NSArray <NSString *>", f) : "number" === typeof g || "boolean" === typeof g ? c += x("NSArray <NSNumber *>", f) : "object" === typeof g && (h += "Item", c += x("NSArray <" + h + " *>", f), b = y(b, e), k = 0 < k.length ? k + "\r\n\r\n" + t(h, b) : t(h, b), l = 0 < l.length ? l + "\r\n\r\n" + u(h) : u(h))
            } else r(b) ? (b = y(b, e), c += x(h, f), k = 0 < k.length ? k + "\r\n\r\n" + t(h, b) : t(h, b), l = 0 < l.length ? l + "\r\n\r\n" + u(h) : u(h)) : "string" === typeof b ? c += "@property (nonatomic, copy) NSString *" + f + ";\n": "number" === typeof b ? c = 0 <= b.toString().indexOf(".") ? c + E("CGFloat", f) : c + E("NSInteger", f) : "boolean" === typeof b && (c += E("BOOL", f))
        } else alert("key = " + d);
        return c
    },
    z = function(a, d) {
        var c = "";
        if (q(a)) {
            if (0 < a.length && 0 < a.length) {
                for (var e = a[0], f = a.length - 1; 0 <= f; f--) {
                    var b = a[f];
                    q(b) ? b.length > e.length && (e = b) : r(b) && Object.keys(b).length > Object.keys(e).length && (e = b)
                }
                c += z(e, d)
            }
        } else if (r(a)) for (e in a) {
            b = a[e];
            var h = p(e),
            g = B(e);
            q(b) ? (0 < b.length && (f = b[0]), "string" === typeof f ? c += "    public String    " + g + ";\r\n": "number" === typeof f || "boolean" === typeof f ? c += "    public int    " + g + ";\r\n": "object" === typeof f && (h += "Item", c += "    public List<" + h + "> " + g + ";\r\n", b = F(h) + z(b, e) + "}\r\n", m = 0 < m.length ? m + "\r\n" + b: b)) : r(b) ? (b = F(p(g)) + z(b, e) + "}\r\n", m = 0 < m.length ? m + "\r\n" + b: b) : "string" === typeof b ? c += "    public String    " + g + ";\r\n": "number" === typeof b ? c = 0 <= b.toString().indexOf(".") ? c + ("    public double    " + g + ";\r\n") : c + ("    public int    " + g + ";\r\n") : "boolean" === typeof b && (c += "    public boolean    " + g + ";\r\n")
        } else alert("key = " + d);
        return c
    };
    return {
        objectcModel: function() {
            this.clearContent();
            D();
            var a = document.getElementById("fileName").value.trim(),
            d = editor_json.getValue();
            d = eval("(" + d + ")");
            H(d, p(a))
        },
        javaBean: function() {
            this.clearContent();
            D();
            var a = document.getElementById("fileName").value.trim(),
            d = editor_json.getValue();
            d = eval("(" + d + ")");
            I(d, p(a))
        },
        swiftModel: function() {
            this.clearContent();
            D();
            var a = document.getElementById("fileName").value.trim(),
            d = editor_json.getValue();
            d = eval("(" + d + ")");
            J(d, p(a))
        },
        qtModel: function() {
            this.clearContent();
            D();
            var a = document.getElementById("fileName").value.trim(),
            d = editor_json.getValue();
            d = eval("(" + d + ")");
            K(d, p(a))
        },
        clearContent: function() {
            document.getElementById("result-container").removeAttribute("class");
            document.getElementById("precode").innerHTML = ""
        },
        downloadFile: function() {
            var a = p(document.getElementById("fileName").value.trim());
            0 == a.length && (a = "ModelName");
            if (0 < k.length && 0 < l.length) {
                var d = new JSZip;
                d.file(a + ".h", k);
                d.file(a + ".m", l);
                d.generateAsync({
                    type: "blob"
                }).then(function(c) {
                    saveAs(c, a + ".zip")
                })
            } else if (0 < v.length) {
                data = [];
                data.push(m + "\r\n" + v);
                properties = {
                    type: "plain/text"
                };
                try {
                    file = new File(data, a + ".java", properties)
                } catch(c) {
                    file = new Blob(data, properties)
                }
                url = URL.createObjectURL(file);
                location.href = url
            } else if (0 < w.length) {
                data = [];
                data.push(n + "\r\n" + w);
                properties = {
                    type: "plain/text"
                };
                try {
                    file = new File(data, a + ".swift", properties)
                } catch(c) {
                    file = new Blob(data, properties)
                }
                url = URL.createObjectURL(file);
                location.href = url
            } else this.clearContent(),
            document.getElementById("result-container").setAttribute("class", "shown"),
            document.getElementById("result").innerHTML = "there is nothing to download!",
            document.getElementById("result").className = "error"
        }
    }
} ();