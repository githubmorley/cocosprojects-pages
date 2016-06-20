require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"HelloWorld":[function(require,module,exports){
"use strict";
cc._RFpush(module, '280c3rsZJJKnZ9RqbALVwtK', 'HelloWorld');
// Script/HelloWorld.js

cc.Class({
    "extends": cc.Component,

    properties: {
        tiledMap: { // マップデータを保持
            "default": null, // 初期値
            type: cc.TiledMap }
    },

    // データの型
    // 初期化処理
    onLoad: function onLoad() {
        // 物理空間の設定
        this.space = new cp.Space(); // Space（物理空間）を作成
        this.space.gravity = cp.v(0, -350); // 重力を設定
        this.setupDebugNode(); // デバッグ用の表示（物理演算上の物体の境界を表示）

        // タイルマップのオフセットを計算
        this.tiledMapOffset = this.tiledMap.node.position;

        // オブジェクトの読込
        var objects = this.tiledMap.getObjectGroup("object1").getObjects(); // マップからオブジェクトの配列を取得
        for (var i = 0; i < objects.length; i++) {
            // オブジェクトの配列数分ループ
            var curObject = objects[i]; // オブジェクトを取得
            // オブジェクトの基準点の位置を取得
            var objectPos = cp.v.add(cp.v(Number(curObject.x), Number(curObject.y)), // 文字から数値に変換
            this.tiledMapOffset); // オフセット値を加算
            // オブジェクトのサイズを取得
            var objectSize = cp.v(Number(curObject.width), Number(curObject.height)); // 文字から数値に変換
            var objectBody = new cp.StaticBody(); // 静的ボディを生成
            var objectElasticity = 0.5; // 弾性係数
            var objectFriction = 0.5; // 摩擦係数
            switch (curObject.type) {// タイプ別に処理を行う
                case "polyline":
                    for (var j = 0; j < curObject.polylinePoints.length - 1; j++) {
                        // 頂点数分ループ
                        // 取得した座標値を文字列から数値に変換
                        var start = cp.v(Number(curObject.polylinePoints[j].x), -Number(curObject.polylinePoints[j].y)); // yは正負反転
                        var end = cp.v(Number(curObject.polylinePoints[j + 1].x), -Number(curObject.polylinePoints[j + 1].y)); // yは正負反転
                        start.add(objectPos); // Canvasの座標に変換
                        end.add(objectPos); // Canvasの座標に変換
                        var segmentShape = new cp.SegmentShape( // 線形状のShapeを作成
                        objectBody, // 静的ボディを設定
                        start, // 始点座標
                        end, // 終点座標
                        0); // 線の太さ
                        segmentShape.setElasticity(objectElasticity); // 弾性係数を設定
                        segmentShape.setFriction(objectFriction); // 摩擦係数を設定
                        this.space.addStaticShape(segmentShape); // Spaceに地面（静的ボディ）を追加
                    }
                    break;
                case "box":
                    //objectBody.setPos(objectPos.add(cp.v.mult(objectSize, 0.5))); // Boxの中心座標（左下の座標+サイズの1/2）
                    objectBody.p = cp.v.add(objectPos, cp.v(objectSize.x * 0.5, objectSize.y * 0.5));
                    var boxShape = new cp.BoxShape( // Box形状のShapeを作成
                    objectBody, objectSize.x, objectSize.y); // Shapeを作成
                    boxShape.setElasticity(objectElasticity); // 弾性係数を設定
                    boxShape.setFriction(objectFriction); // 摩擦係数を設定
                    this.space.addShape(boxShape); // Shapeを追加
                    break;
                case "circle":
                    objectBody.p = cp.v.add(objectPos, cp.v(objectSize.x * 0.5, objectSize.y * 0.5));
                    var circleShape = new cp.CircleShape( // Circle形状のShapeを作成
                    objectBody, objectSize.x * 0.5, cp.vzero); // Shapeを作成
                    circleShape.setElasticity(objectElasticity); // 弾性係数を設定
                    circleShape.setFriction(objectFriction); // 摩擦係数を設定
                    this.space.addShape(circleShape); // Shapeを追加
                    break;
                case "polygon":
                    var verts = [];
                    for (var j = 0; j < curObject.points.length; j++) {
                        // 取得した座標値を文字列から数値に変換
                        var point = cp.v(Number(curObject.points[j].x), -Number(curObject.points[j].y)); // yは正負反転
                        point.add(objectPos); // Canvasの座標に変換
                        verts.push(point.x); // 配列に追加
                        verts.push(point.y); // 配列に追加
                    }
                    var polyShape = new cp.PolyShape( // Polygon形状のShapeを作成
                    objectBody, verts, cp.vzero); // Shapeを作成
                    polyShape.setElasticity(objectElasticity); // 弾性係数を設定
                    polyShape.setFriction(objectFriction); // 摩擦係数を設定
                    this.space.addShape(polyShape); // Shapeを追加
                    break;
            }
        }

        // タッチイベントを追加
        this.node.on(cc.Node.EventType.TOUCH_START, function (touch, event) {
            // タッチした位置にボールを追加
            var body = new cp.Body(1, cp.momentForCircle(1, 0, 16, cp.vzero)); // Bodyを作成
            body.setPos(this.node.convertTouchToNodeSpaceAR(touch)); // touchオブジェクトからタッチ位置を取得
            this.space.addBody(body); // Spaceに追加
            var shape = new cp.CircleShape(body, 16, cp.vzero); //Circle形状のShapeを作成
            shape.setElasticity(0.5); // 弾性係数を設定
            shape.setFriction(0.5); // 摩擦係数を設定
            this.space.addShape(shape); // Shapeを追加
        }, this);
    },

    // ループ処理
    update: function update(dt) {
        this.space.step(dt); // dt時間分の物理演算を行う
    },

    // デバッグ用の表示
    setupDebugNode: function setupDebugNode() {
        // 物理空間のデバッグ表示
        this.debugNode = cc.PhysicsDebugNode.create(this.space);
        this.debugNode.visible = true;
        this.debugNode.setPosition(0, 0);
        this.node._sgNode.addChild(this.debugNode, 100);
    }
});

cc._RFpop();
},{}]},{},["HelloWorld"])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL0FwcGxpY2F0aW9ucy9Db2Nvc0NyZWF0b3IuYXBwL0NvbnRlbnRzL1Jlc291cmNlcy9hcHAuYXNhci9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiU2NyaXB0L0hlbGxvV29ybGQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJzI4MGMzcnNaSkpLblo5UnFiQUxWd3RLJywgJ0hlbGxvV29ybGQnKTtcbi8vIFNjcmlwdC9IZWxsb1dvcmxkLmpzXG5cbmNjLkNsYXNzKHtcbiAgICBcImV4dGVuZHNcIjogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICB0aWxlZE1hcDogeyAvLyDjg57jg4Pjg5fjg4fjg7zjgr/jgpLkv53mjIFcbiAgICAgICAgICAgIFwiZGVmYXVsdFwiOiBudWxsLCAvLyDliJ3mnJ/lgKRcbiAgICAgICAgICAgIHR5cGU6IGNjLlRpbGVkTWFwIH1cbiAgICB9LFxuXG4gICAgLy8g44OH44O844K/44Gu5Z6LXG4gICAgLy8g5Yid5pyf5YyW5Yem55CGXG4gICAgb25Mb2FkOiBmdW5jdGlvbiBvbkxvYWQoKSB7XG4gICAgICAgIC8vIOeJqeeQhuepuumWk+OBruioreWumlxuICAgICAgICB0aGlzLnNwYWNlID0gbmV3IGNwLlNwYWNlKCk7IC8vIFNwYWNl77yI54mp55CG56m66ZaT77yJ44KS5L2c5oiQXG4gICAgICAgIHRoaXMuc3BhY2UuZ3Jhdml0eSA9IGNwLnYoMCwgLTM1MCk7IC8vIOmHjeWKm+OCkuioreWumlxuICAgICAgICB0aGlzLnNldHVwRGVidWdOb2RlKCk7IC8vIOODh+ODkOODg+OCsOeUqOOBruihqOekuu+8iOeJqeeQhua8lOeul+S4iuOBrueJqeS9k+OBruWig+eVjOOCkuihqOekuu+8iVxuXG4gICAgICAgIC8vIOOCv+OCpOODq+ODnuODg+ODl+OBruOCquODleOCu+ODg+ODiOOCkuioiOeul1xuICAgICAgICB0aGlzLnRpbGVkTWFwT2Zmc2V0ID0gdGhpcy50aWxlZE1hcC5ub2RlLnBvc2l0aW9uO1xuXG4gICAgICAgIC8vIOOCquODluOCuOOCp+OCr+ODiOOBruiqrei+vFxuICAgICAgICB2YXIgb2JqZWN0cyA9IHRoaXMudGlsZWRNYXAuZ2V0T2JqZWN0R3JvdXAoXCJvYmplY3QxXCIpLmdldE9iamVjdHMoKTsgLy8g44Oe44OD44OX44GL44KJ44Kq44OW44K444Kn44Kv44OI44Gu6YWN5YiX44KS5Y+W5b6XXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgb2JqZWN0cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgLy8g44Kq44OW44K444Kn44Kv44OI44Gu6YWN5YiX5pWw5YiG44Or44O844OXXG4gICAgICAgICAgICB2YXIgY3VyT2JqZWN0ID0gb2JqZWN0c1tpXTsgLy8g44Kq44OW44K444Kn44Kv44OI44KS5Y+W5b6XXG4gICAgICAgICAgICAvLyDjgqrjg5bjgrjjgqfjgq/jg4jjga7ln7rmupbngrnjga7kvY3nva7jgpLlj5blvpdcbiAgICAgICAgICAgIHZhciBvYmplY3RQb3MgPSBjcC52LmFkZChjcC52KE51bWJlcihjdXJPYmplY3QueCksIE51bWJlcihjdXJPYmplY3QueSkpLCAvLyDmloflrZfjgYvjgonmlbDlgKTjgavlpInmj5tcbiAgICAgICAgICAgIHRoaXMudGlsZWRNYXBPZmZzZXQpOyAvLyDjgqrjg5Xjgrvjg4Pjg4jlgKTjgpLliqDnrpdcbiAgICAgICAgICAgIC8vIOOCquODluOCuOOCp+OCr+ODiOOBruOCteOCpOOCuuOCkuWPluW+l1xuICAgICAgICAgICAgdmFyIG9iamVjdFNpemUgPSBjcC52KE51bWJlcihjdXJPYmplY3Qud2lkdGgpLCBOdW1iZXIoY3VyT2JqZWN0LmhlaWdodCkpOyAvLyDmloflrZfjgYvjgonmlbDlgKTjgavlpInmj5tcbiAgICAgICAgICAgIHZhciBvYmplY3RCb2R5ID0gbmV3IGNwLlN0YXRpY0JvZHkoKTsgLy8g6Z2Z55qE44Oc44OH44Kj44KS55Sf5oiQXG4gICAgICAgICAgICB2YXIgb2JqZWN0RWxhc3RpY2l0eSA9IDAuNTsgLy8g5by+5oCn5L+C5pWwXG4gICAgICAgICAgICB2YXIgb2JqZWN0RnJpY3Rpb24gPSAwLjU7IC8vIOaRqeaTpuS/guaVsFxuICAgICAgICAgICAgc3dpdGNoIChjdXJPYmplY3QudHlwZSkgey8vIOOCv+OCpOODl+WIpeOBq+WHpueQhuOCkuihjOOBhlxuICAgICAgICAgICAgICAgIGNhc2UgXCJwb2x5bGluZVwiOlxuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IGN1ck9iamVjdC5wb2x5bGluZVBvaW50cy5sZW5ndGggLSAxOyBqKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIOmggueCueaVsOWIhuODq+ODvOODl1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8g5Y+W5b6X44GX44Gf5bqn5qiZ5YCk44KS5paH5a2X5YiX44GL44KJ5pWw5YCk44Gr5aSJ5o+bXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgc3RhcnQgPSBjcC52KE51bWJlcihjdXJPYmplY3QucG9seWxpbmVQb2ludHNbal0ueCksIC1OdW1iZXIoY3VyT2JqZWN0LnBvbHlsaW5lUG9pbnRzW2pdLnkpKTsgLy8geeOBr+ato+iyoOWPjei7olxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGVuZCA9IGNwLnYoTnVtYmVyKGN1ck9iamVjdC5wb2x5bGluZVBvaW50c1tqICsgMV0ueCksIC1OdW1iZXIoY3VyT2JqZWN0LnBvbHlsaW5lUG9pbnRzW2ogKyAxXS55KSk7IC8vIHnjga/mraPosqDlj43ou6JcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0LmFkZChvYmplY3RQb3MpOyAvLyBDYW52YXPjga7luqfmqJnjgavlpInmj5tcbiAgICAgICAgICAgICAgICAgICAgICAgIGVuZC5hZGQob2JqZWN0UG9zKTsgLy8gQ2FudmFz44Gu5bqn5qiZ44Gr5aSJ5o+bXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgc2VnbWVudFNoYXBlID0gbmV3IGNwLlNlZ21lbnRTaGFwZSggLy8g57ea5b2i54q244GuU2hhcGXjgpLkvZzmiJBcbiAgICAgICAgICAgICAgICAgICAgICAgIG9iamVjdEJvZHksIC8vIOmdmeeahOODnOODh+OCo+OCkuioreWumlxuICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnQsIC8vIOWni+eCueW6p+aomVxuICAgICAgICAgICAgICAgICAgICAgICAgZW5kLCAvLyDntYLngrnluqfmqJlcbiAgICAgICAgICAgICAgICAgICAgICAgIDApOyAvLyDnt5rjga7lpKrjgZVcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlZ21lbnRTaGFwZS5zZXRFbGFzdGljaXR5KG9iamVjdEVsYXN0aWNpdHkpOyAvLyDlvL7mgKfkv4LmlbDjgpLoqK3lrppcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlZ21lbnRTaGFwZS5zZXRGcmljdGlvbihvYmplY3RGcmljdGlvbik7IC8vIOaRqeaTpuS/guaVsOOCkuioreWumlxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zcGFjZS5hZGRTdGF0aWNTaGFwZShzZWdtZW50U2hhcGUpOyAvLyBTcGFjZeOBq+WcsOmdou+8iOmdmeeahOODnOODh+OCo++8ieOCkui/veWKoFxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgXCJib3hcIjpcbiAgICAgICAgICAgICAgICAgICAgLy9vYmplY3RCb2R5LnNldFBvcyhvYmplY3RQb3MuYWRkKGNwLnYubXVsdChvYmplY3RTaXplLCAwLjUpKSk7IC8vIEJveOOBruS4reW/g+W6p+aome+8iOW3puS4i+OBruW6p+aomSvjgrXjgqTjgrrjga4xLzLvvIlcbiAgICAgICAgICAgICAgICAgICAgb2JqZWN0Qm9keS5wID0gY3Audi5hZGQob2JqZWN0UG9zLCBjcC52KG9iamVjdFNpemUueCAqIDAuNSwgb2JqZWN0U2l6ZS55ICogMC41KSk7XG4gICAgICAgICAgICAgICAgICAgIHZhciBib3hTaGFwZSA9IG5ldyBjcC5Cb3hTaGFwZSggLy8gQm945b2i54q244GuU2hhcGXjgpLkvZzmiJBcbiAgICAgICAgICAgICAgICAgICAgb2JqZWN0Qm9keSwgb2JqZWN0U2l6ZS54LCBvYmplY3RTaXplLnkpOyAvLyBTaGFwZeOCkuS9nOaIkFxuICAgICAgICAgICAgICAgICAgICBib3hTaGFwZS5zZXRFbGFzdGljaXR5KG9iamVjdEVsYXN0aWNpdHkpOyAvLyDlvL7mgKfkv4LmlbDjgpLoqK3lrppcbiAgICAgICAgICAgICAgICAgICAgYm94U2hhcGUuc2V0RnJpY3Rpb24ob2JqZWN0RnJpY3Rpb24pOyAvLyDmkanmk6bkv4LmlbDjgpLoqK3lrppcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zcGFjZS5hZGRTaGFwZShib3hTaGFwZSk7IC8vIFNoYXBl44KS6L+95YqgXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgXCJjaXJjbGVcIjpcbiAgICAgICAgICAgICAgICAgICAgb2JqZWN0Qm9keS5wID0gY3Audi5hZGQob2JqZWN0UG9zLCBjcC52KG9iamVjdFNpemUueCAqIDAuNSwgb2JqZWN0U2l6ZS55ICogMC41KSk7XG4gICAgICAgICAgICAgICAgICAgIHZhciBjaXJjbGVTaGFwZSA9IG5ldyBjcC5DaXJjbGVTaGFwZSggLy8gQ2lyY2xl5b2i54q244GuU2hhcGXjgpLkvZzmiJBcbiAgICAgICAgICAgICAgICAgICAgb2JqZWN0Qm9keSwgb2JqZWN0U2l6ZS54ICogMC41LCBjcC52emVybyk7IC8vIFNoYXBl44KS5L2c5oiQXG4gICAgICAgICAgICAgICAgICAgIGNpcmNsZVNoYXBlLnNldEVsYXN0aWNpdHkob2JqZWN0RWxhc3RpY2l0eSk7IC8vIOW8vuaAp+S/guaVsOOCkuioreWumlxuICAgICAgICAgICAgICAgICAgICBjaXJjbGVTaGFwZS5zZXRGcmljdGlvbihvYmplY3RGcmljdGlvbik7IC8vIOaRqeaTpuS/guaVsOOCkuioreWumlxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNwYWNlLmFkZFNoYXBlKGNpcmNsZVNoYXBlKTsgLy8gU2hhcGXjgpLov73liqBcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBcInBvbHlnb25cIjpcbiAgICAgICAgICAgICAgICAgICAgdmFyIHZlcnRzID0gW107XG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgY3VyT2JqZWN0LnBvaW50cy5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8g5Y+W5b6X44GX44Gf5bqn5qiZ5YCk44KS5paH5a2X5YiX44GL44KJ5pWw5YCk44Gr5aSJ5o+bXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcG9pbnQgPSBjcC52KE51bWJlcihjdXJPYmplY3QucG9pbnRzW2pdLngpLCAtTnVtYmVyKGN1ck9iamVjdC5wb2ludHNbal0ueSkpOyAvLyB544Gv5q2j6LKg5Y+N6LuiXG4gICAgICAgICAgICAgICAgICAgICAgICBwb2ludC5hZGQob2JqZWN0UG9zKTsgLy8gQ2FudmFz44Gu5bqn5qiZ44Gr5aSJ5o+bXG4gICAgICAgICAgICAgICAgICAgICAgICB2ZXJ0cy5wdXNoKHBvaW50LngpOyAvLyDphY3liJfjgavov73liqBcbiAgICAgICAgICAgICAgICAgICAgICAgIHZlcnRzLnB1c2gocG9pbnQueSk7IC8vIOmFjeWIl+OBq+i/veWKoFxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHZhciBwb2x5U2hhcGUgPSBuZXcgY3AuUG9seVNoYXBlKCAvLyBQb2x5Z29u5b2i54q244GuU2hhcGXjgpLkvZzmiJBcbiAgICAgICAgICAgICAgICAgICAgb2JqZWN0Qm9keSwgdmVydHMsIGNwLnZ6ZXJvKTsgLy8gU2hhcGXjgpLkvZzmiJBcbiAgICAgICAgICAgICAgICAgICAgcG9seVNoYXBlLnNldEVsYXN0aWNpdHkob2JqZWN0RWxhc3RpY2l0eSk7IC8vIOW8vuaAp+S/guaVsOOCkuioreWumlxuICAgICAgICAgICAgICAgICAgICBwb2x5U2hhcGUuc2V0RnJpY3Rpb24ob2JqZWN0RnJpY3Rpb24pOyAvLyDmkanmk6bkv4LmlbDjgpLoqK3lrppcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zcGFjZS5hZGRTaGFwZShwb2x5U2hhcGUpOyAvLyBTaGFwZeOCkui/veWKoFxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIOOCv+ODg+ODgeOCpOODmeODs+ODiOOCkui/veWKoFxuICAgICAgICB0aGlzLm5vZGUub24oY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfU1RBUlQsIGZ1bmN0aW9uICh0b3VjaCwgZXZlbnQpIHtcbiAgICAgICAgICAgIC8vIOOCv+ODg+ODgeOBl+OBn+S9jee9ruOBq+ODnOODvOODq+OCkui/veWKoFxuICAgICAgICAgICAgdmFyIGJvZHkgPSBuZXcgY3AuQm9keSgxLCBjcC5tb21lbnRGb3JDaXJjbGUoMSwgMCwgMTYsIGNwLnZ6ZXJvKSk7IC8vIEJvZHnjgpLkvZzmiJBcbiAgICAgICAgICAgIGJvZHkuc2V0UG9zKHRoaXMubm9kZS5jb252ZXJ0VG91Y2hUb05vZGVTcGFjZUFSKHRvdWNoKSk7IC8vIHRvdWNo44Kq44OW44K444Kn44Kv44OI44GL44KJ44K/44OD44OB5L2N572u44KS5Y+W5b6XXG4gICAgICAgICAgICB0aGlzLnNwYWNlLmFkZEJvZHkoYm9keSk7IC8vIFNwYWNl44Gr6L+95YqgXG4gICAgICAgICAgICB2YXIgc2hhcGUgPSBuZXcgY3AuQ2lyY2xlU2hhcGUoYm9keSwgMTYsIGNwLnZ6ZXJvKTsgLy9DaXJjbGXlvaLnirbjga5TaGFwZeOCkuS9nOaIkFxuICAgICAgICAgICAgc2hhcGUuc2V0RWxhc3RpY2l0eSgwLjUpOyAvLyDlvL7mgKfkv4LmlbDjgpLoqK3lrppcbiAgICAgICAgICAgIHNoYXBlLnNldEZyaWN0aW9uKDAuNSk7IC8vIOaRqeaTpuS/guaVsOOCkuioreWumlxuICAgICAgICAgICAgdGhpcy5zcGFjZS5hZGRTaGFwZShzaGFwZSk7IC8vIFNoYXBl44KS6L+95YqgXG4gICAgICAgIH0sIHRoaXMpO1xuICAgIH0sXG5cbiAgICAvLyDjg6vjg7zjg5flh6bnkIZcbiAgICB1cGRhdGU6IGZ1bmN0aW9uIHVwZGF0ZShkdCkge1xuICAgICAgICB0aGlzLnNwYWNlLnN0ZXAoZHQpOyAvLyBkdOaZgumWk+WIhuOBrueJqeeQhua8lOeul+OCkuihjOOBhlxuICAgIH0sXG5cbiAgICAvLyDjg4fjg5Djg4PjgrDnlKjjga7ooajnpLpcbiAgICBzZXR1cERlYnVnTm9kZTogZnVuY3Rpb24gc2V0dXBEZWJ1Z05vZGUoKSB7XG4gICAgICAgIC8vIOeJqeeQhuepuumWk+OBruODh+ODkOODg+OCsOihqOekulxuICAgICAgICB0aGlzLmRlYnVnTm9kZSA9IGNjLlBoeXNpY3NEZWJ1Z05vZGUuY3JlYXRlKHRoaXMuc3BhY2UpO1xuICAgICAgICB0aGlzLmRlYnVnTm9kZS52aXNpYmxlID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5kZWJ1Z05vZGUuc2V0UG9zaXRpb24oMCwgMCk7XG4gICAgICAgIHRoaXMubm9kZS5fc2dOb2RlLmFkZENoaWxkKHRoaXMuZGVidWdOb2RlLCAxMDApO1xuICAgIH1cbn0pO1xuXG5jYy5fUkZwb3AoKTsiXX0=
