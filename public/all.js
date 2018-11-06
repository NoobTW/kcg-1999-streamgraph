$('#from').on('change', loadData);
$('#to').on('change', loadData);

$(function(){
	loadData();
});

function loadData(){

	var from = $('#from').val();
	var to = $('#to').val();

	if(!from.length || !to.length) return;
	if(new Date(from).getTime() > new Date(to).getTime()) return;

	$('h3').text('正在載入 ' + from + ' 到 ' + to + ' 的資料（可能需要一點時間）');
	$.getJSON('/api?startDate=' + from + '&endDate=' + to, function(r){
		var streamgraphRawData = [];
		var data = r.results;
		Array.from(data).forEach(function(event){
			var type = getNameByCategory(getCategoryByName(event.informDesc));
			var time = '20' + moment(event.cre_Date).format('HH');
			streamgraphRawData.push({
				year: time,
				place: type,
				type: 'kcg',
			});
			if(time === '2023'){
				streamgraphRawData.push({
					year: '2024',
					place: type,
					type: 'kcg',
				});
			}
		});
		window.weeklyData = streamgraphRawData;
		chart(column,filterBy,groupBy);
		$('h3').text(r.startDate + '~' + r.endDate + ' 量化波形圖');
	});
}

function getCategoryByName(name){
	switch(name){
		case '路面坑洞(一)':
		case '路面坑洞(二)':
		case '路面下陷(一)':
		case '路面下陷(二)':
		case '路面掏空(一)':
		case '路面掏空(二)':
		case '台電-路面填補不實':
		case '中華-路面填補不實':
		case '人孔蓋鬆動':
		case '台電-孔蓋鬆動':
		case '中華-孔蓋鬆動':
		case '寬頻孔蓋坑洞':
		case '寬頻孔蓋鬆動破損':
		case '中華-孔蓋路面下陷':
		case '台電-孔蓋路面下陷':
		case '道路回填不實':
		case '施工回填不實、人孔蓋凹陷坑洞':
		case '人孔蓋凹陷坑洞(一)':
		case '人孔蓋凹陷坑洞(二)':
		case '人孔、溝蓋鬆動(一)':
		case '人孔、溝蓋鬆動(二)':
		case '溝蓋破損(一)':
		case '溝蓋破損(二)':
		case '人手孔凹陷':
		case '人手孔破損':
		case '路面塌陷(一)':
		case '路面塌陷(二)':
		case '寬頻管線破損':
		case '省道破損':
		case '縣、鄉道破損':
		case '農道破損':
		case '管線問題':
		case '管道(工程通報)':
			return 'work-road';
		case '地下道、路面積水(一)':
		case '地下道、路面積水(二)　養工處2':
		case '污水管阻塞(一)':
		case '暴雨積水(一)':
		case '暴雨積水(二)':
			return 'work-pipe';
		case '路燈故障(一)':
		case '公所-路燈故障(二)':
		case '養工-路燈故障(二)':
		case '路燈白天未熄(一)':
		case '公所-路燈白天未熄(二)':
		case '養工-路燈白天未熄(二)':
			return 'work-light';
		case '人行道破損(一)':
		case '人行道破損(二)':
		case '人行道設施損壞(一)':
		case '公所-人行道設施損壞(二)':
		case '養工-人行道設施損壞(二)':
		case '公園、綠地設施損毀(一)':
		case '公園髒亂、佔用(一)':
		case '公園土木局部損壞':
		case '公所-公園、綠地設施損毀(二)':
		case '公所-公園髒亂、佔用(二)':
		case '養工-公園、綠地設施損毀(二)':
		case '養工-公園髒亂、佔用(二)':
		case '安全島髒亂':
		case '安全島雜草叢生(一)':
		case '安全島雜草叢生(二)':
		case '路樹傾倒(一)':
		case '養工-路樹傾倒(二)':
		case '公所-路樹傾倒(二)':
			return 'work-park';
		case '號誌故障':
		case '號誌秒差調整':
			return 'work-traffic';
		case '違規停車':
		case '佔用道路':
		case '交通疏導':
		case '妨害安寧':
		case '急迫危害立即排除':
			return 'work-car';
		case '路面油漬':
		case '空氣污染':
		case '噪音':
		case '髒亂清除':
		case '垃圾清運':
		case '小廣告、旗幟':
		case '人行道髒亂':
		case '怠速':
		case '燃放爆竹':
			return 'work-noise';
		case '動物受傷、受困、挨餓':
		case '攻擊性流浪犬捕捉':
		case '動物受困':
		case '動保測試項目':
		case '攻擊性流浪犬捕捉、動物受傷':
			return 'work-animal';
		case '風景區髒亂':
		case '風景區設備損壞有立即危險者':
			return 'work-view';
		case '停水':
		case '消防栓漏水':
		case '檢修管線':
			return 'work-water';
		case '電線掉落':
		case '變壓器有聲音':
		case '停電':
		case '漏電':
			return 'work-electricity';
		case '瓦斯外洩':
		case '欣高-孔蓋路面下陷':
		case '欣高-孔蓋鬆動':
		case '欣高-路面填補不實':
			return 'work-gas'
	}
}

function getNameByCategory(x){
	switch(x){
		case 'work-road': return '道路不平';
		case 'work-pipe': return '積水、汙水管';
		case 'work-light': return '路燈故障';
		case 'work-park': return '公園、路樹、人行道';
		case 'work-traffic': return '交通號誌';
		case 'work-car': return '交通違規、路霸';
		case 'work-noise': return '髒亂、噪音、空汙';
		case 'work-animal': return '動物保護';
		case 'work-view': '風景區維護';
		case 'work-water': return '自來水相關';
		case 'work-electricity': return '電力相關';
		case 'work-gas': return '不明氣體外洩';
	}
}