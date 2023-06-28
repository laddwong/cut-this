// 平面直角坐标系计算工具

/**
 * 两点间距离
 * @param {Number} x1 A点x轴坐标
 * @param {Number} y1 A点y轴坐标
 * @param {Number} x2 B点x轴坐标
 * @param {Number} y2 B点y轴坐标
 * @returns 
 */
export function distanceBetweenPoints(x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * 两点连线的角度
 * @param {Number} x1 A点x轴坐标
 * @param {Number} y1 A点y轴坐标
 * @param {Number} x2 B点x轴坐标
 * @param {Number} y2 B点y轴坐标
 * @returns 
 */
export function angleBetweenPoints(x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const angle = Math.atan2(dy, dx);
  return angle * (180 / Math.PI);
}

/**
 * 两点连线的中点
 * @param {Number} x1 A点x轴坐标
 * @param {Number} y1 A点y轴坐标
 * @param {Number} x2 B点x轴坐标
 * @param {Number} y2 B点y轴坐标
 * @returns 
 */
export function midpointBetweenPoints(x1, y1, x2, y2) {
  const xm = (x1 + x2) / 2;
  const ym = (y1 + y2) / 2;
  return [xm, ym];
}

function sqr(x){
	return x * x;
}

function sign(n){
	return n < 0 ? -1 : ( n > 0 ? 1 : 0 );
}

function equation12( a, b, c ){
	if(a == 0)return;

	var delta = b * b - 4 * a * c;
	if(delta == 0)
		return [ -1 * b / (2 * a), -1 * b / (2 * a) ];
	else if(delta > 0)
		return [ (-1 * b + Math.sqrt(delta)) / (2 * a),  (-1 * b - Math.sqrt(delta)) / (2 * a) ];
}

/**
 * 返回线段和圆形的交点，不相交则返回null
 * @param {Array<Number>} p1 线段A点
 * @param {Array<Number>} p2 线段B点
 * @param {Array<Number>} c 圆心
 * @param {Number} r 半径
 * @param {Number} e 离心率，默认1
 * @returns 
 */
export function lineXEllipse( p1, p2, c, r, e ){
	if (r <= 0) return;
	e = e === undefined ? 1 : e;
	var t1 = r, t2 = r * e, k;

	var a = sqr( t2) * sqr(p1[0] - p2[0]) + sqr(t1) * sqr(p1[1] - p2[1]);

	if (a <= 0) return;
	
	var b = 2 * sqr(t2) * (p2[0] - p1[0]) * (p1[0] - c[0]) + 2 * sqr(t1) * (p2[1] - p1[1]) * (p1[1] - c[1]);
	var c = sqr(t2) * sqr(p1[0] - c[0]) + sqr(t1) * sqr(p1[1] - c[1]) - sqr(t1) * sqr(t2);
	
	if (!( k = equation12(a, b, c, t1, t2) )) return;
	
	var result = [
		[ p1[0] + k[0] * (p2[0] - p1[0]), p1[1] + k[0] * (p2[1] - p1[1]) ],
		[ p1[0] + k[1] * (p2[0] - p1[0]), p1[1] + k[1] * (p2[1] - p1[1]) ]
	];
	
	if ( !( ( sign( result[0][0] - p1[0] ) * sign( result[0][0] - p2[0] ) <= 0 ) &&
		( sign( result[0][1] - p1[1] ) * sign( result[0][1] - p2[1] ) <= 0 ) ) )
		result[0] = null;

	if ( !( ( sign( result[1][0] - p1[0] ) * sign( result[1][0] - p2[0] ) <= 0 ) &&
		( sign( result[1][1] - p1[1] ) * sign( result[1][1] - p2[1] ) <= 0 ) ) )
		result[1] = null;

	return result;
}