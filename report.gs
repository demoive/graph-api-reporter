var REPORT_PROPS = {};
function getReportPropertiesFromFormInputs(form) {
  var reportTypeId = form.scope + '.' + form.metric;
  var props = REPORT_PROPS[reportTypeId];
  props.form = form;

  return props;
}

////////////////////////////////////////////////////////////////////////////////

var props = {

  all_views: {
    apiPath: '/?fields=instant_articles_insights.metric(all_views).period(day)',
    columnHeadings: ['Date', 'Value'],
    chartTitle: 'Total Daily Views',
    chartType: Charts.ChartType.LINE,
    chartPosition: [1, 3, 5, 5],
    chartOptionLegend: {position: 'top', textStyle: {color: 'blue', fontSize: 16}}
  }

};

////////////////////////////////////////////////////////////////////////////////

function getApiEndpointForFormInputs(form) {
  var endpoints = {
    'aggregate.all_views':                  '/{{page-id}}?fields=instant_articles_insights.metric({{metric}}).period(day).since({{rangeStart}}).until({{rangeEnd}})',
    'aggregate.all_view_durations_average': '/{{page-id}}?fields=instant_articles_insights.metric({{metric}}).period(week).since({{rangeStart}}).until({{rangeEnd}})',
    'aggregate.all_scrolls_average':        '/{{page-id}}?fields=instant_articles_insights.metric({{metric}}).period(week).since({{rangeStart}}).until({{rangeEnd}})',

       'single.all_views':                  '/?fields=instant_article%7Binsights.metric({{metric}}).period(day).since({{rangeStart}}).until({{rangeEnd}})%7D&id={{canonical-url}}',
       'single.all_view_durations_average': '/?fields=instant_article{insights.metric({{metric}}).period(week).since({{rangeStart}}).until({{rangeEnd}})}&id={{canonical-url}}',
       'single.all_scrolls_average':        '/?fields=instant_article{insights.metric({{metric}}).period(week).since({{rangeStart}}).until({{rangeEnd}})}&id={{canonical-url}}'
  };
form["canonical-url"] = encodeURIComponent(form["canonical-url"]);
  return endpoints[form.scope+'.'+form.metric].supplant(form); //+'&limit=' + 500;
}

////////////////////////////////////////////////////////////////////////////////

function submitReport(formInputs) {
  //var startingEndpoint = getApiEndpointForFormInputs(formInputs);
  //var prop = getReportPropertiesFromFormInputs(formInputs);
  //prop.generate();
  //generateReport(startingEndpoint);

  if (formInputs.scope === 'aggregate' && formInputs.metric ==='all_views') {
    generateReportA1(formInputs);
  }

  if (formInputs.scope === 'aggregate' && formInputs.metric ==='all_view_durations_average') {
    generateReportA2(formInputs);
  }

  if (formInputs.scope === 'aggregate' && formInputs.metric ==='all_scrolls_average') {
    generateReportA3(formInputs);
  }

  if (formInputs.scope === 'single' && formInputs.metric ==='all_views') {
    generateReportB1(formInputs);
  }
}

////////////////////////////////////////////////////////////////////////////////

/** /

//164665060214766?fields=instant_articles_insights.metric(all_views).period(day).since(8 days ago).until(today)

{
  "instant_articles_insights": {
    "data": [
      {
        "name": "all_views",
        "time": "2017-04-20T08:00:00+0000",
        "value": "222"
      },
    ]
  },
  "id": "164665060214766"
}

/**/

function generateReportA1(form) {
  var endpoint = getApiEndpointForFormInputs(form);
  var respData = FB.api(endpoint);

  if (respData.instant_articles_insights !== undefined) {
    var sheet = clearScratchSheet();

    var columnHeadings = ['Date', 'Views'];
    sheet.appendRow(columnHeadings);

    // Write individual values under the appropriate column heading.
    var results = respData.instant_articles_insights.data;
    var range = sheet.getRange(sheet.getLastRow() + 1, 1, results.length, columnHeadings.length);
    range.setValues(results.map(function (result) {
      return [datetimeToDate(result.time), result.value];
    }));

    sheet.newChart().asLineChart()

    // Render chart.
    var chart = sheet.newChart()
    .asLineChart() //.setChartType(Charts.ChartType.LINE)
    .addRange(range)
    .setPosition(1, 3, 5, 5)
    //.setOption('animation.duration', 300)
    .setOption('legend', {position: 'bottom', textStyle: {color: 'blue', fontSize: 14}})
    .setOption('title', 'Total Daily Views')
    //.setOption('vAxis.ticks', [new Date(2014,3,15), new Date(2013,5,15)])
    //.setOption('vAxis.type', 'date')
    //.setOption('hAxis.minValue', new Date(2014,3,15))
    //.setOption('hAxis.maxValue', new Date(2013,5,15))
    //.setOption('hAxis.format', 'M/d/yy')
    //.setOption('explorer', {
    //  axis: 'horizontal'
    //})
    //.setOption('trendlines.0', {
    //  type: 'linear',
    //  color: 'green',
    //  lineWidth: 3,
    //  opacity: 0.3,
    //  //showR2: true,
    //  //visibleInLegend: true
    //})
    .setOption('hAxis.slantedText', true)
    .build();
    sheet.insertChart(chart);
  }
}

/** /
// 164665060214766?fields=instant_articles_insights.metric(all_view_durations_average).period(week).since(8 days ago).until(today)

{
  "instant_articles_insights": {
    "data": [
      {
        "name": "all_view_durations_average",
        "time": "2017-04-20T08:00:00+0000",
        "value": "28.377110694183866"
      }
    ]
  },
  "id": "164665060214766"
}

/**/

function generateReportA2(form) {
  var endpoint = getApiEndpointForFormInputs(form);
  var respData = FB.api(endpoint);

  if (respData.instant_articles_insights !== undefined) {
    var sheet = clearScratchSheet();

    var columnHeadings = ['Week', 'Time Spent (sec)'];
    sheet.appendRow(columnHeadings);

    // Write individual values under the appropriate column heading.
    var results = respData.instant_articles_insights.data;
    var range = sheet.getRange(sheet.getLastRow() + 1, 1, results.length, columnHeadings.length);
    range.setValues(results.map(function (result) {
      return [datetimeToDate(result.time), result.value];
    }));
    // range.setNumberFormats([
    //   ['yyyy mmm dd', '0.0']
    // ]);

    sheet.newChart().asLineChart()

    // Render chart.
    var chart = sheet.newChart()
    .asLineChart() //.setChartType(Charts.ChartType.LINE)
    .addRange(range)
    .setPosition(1, 3, 5, 5)
    //.setOption('animation.duration', 300)
    .setOption('legend', {position: 'bottom', textStyle: {color: 'blue', fontSize: 14}})
    .setOption('title', 'Time Spent in seconds (weekly average)')
    .setOption('hAxis.slantedText', true)
    .build();
    sheet.insertChart(chart);
  }
}

/** /
// 164665060214766?fields=instant_articles_insights.metric(all_scrolls_average).period(week).since(8 days ago).until(today)

{
  "instant_articles_insights": {
    "data": [
      {
        "name": "all_scrolls_average",
        "time": "2017-04-20T08:00:00+0000",
        "value": "51"
      }
    ]
  },
  "id": "164665060214766"
}

/**/

function generateReportA3(form) {
  var endpoint = getApiEndpointForFormInputs(form);
  var respData = FB.api(endpoint);

  if (respData.instant_articles_insights !== undefined) {
    var sheet = clearScratchSheet();

    var columnHeadings = ['Week', 'Scroll Depth (%)'];
    sheet.appendRow(columnHeadings);

    // Write individual values under the appropriate column heading.
    var results = respData.instant_articles_insights.data;
    var range = sheet.getRange(sheet.getLastRow() + 1, 1, results.length, columnHeadings.length);
    range.setValues(results.map(function (result) {
      return [datetimeToDate(result.time), result.value];
    }));
    // range.setNumberFormats([
    //   ['yyyy mmm dd', '0.0']
    // ]);

    sheet.newChart().asLineChart()

    // Render chart.
    var chart = sheet.newChart()
    .asLineChart() //.setChartType(Charts.ChartType.LINE)
    .addRange(range)
    .setPosition(1, 3, 5, 5)
    //.setOption('animation.duration', 300)
    .setOption('legend', {position: 'bottom', textStyle: {color: 'blue', fontSize: 14}})
    .setOption('title', 'Scroll Depth (weekly average)')
    .setOption('vAxis.minValue', 0)
    .setOption('vAxis.maxValue', 100)
    //.setOption('vAxis.direction', -1)
    .setOption('hAxis.slantedText', true)
    .build();
    sheet.insertChart(chart);
  }
}

////////////////////////////////////////////////////////////////////////////////

/** /
// ?fields=instant_article{insights.metric(all_views).period(day).since(2017-03-01).until(2017-04-26)}&id=https%3A%2F%2Flikethatwords.com%2Fblind-and-visually-impaired-people-react-to-our-video%2F

{
  "instant_article": {
    "insights": {
      "data": [
        {
          "name": "all_views",
          "time": "2017-04-06T08:00:00+0000",
          "value": "20"
          ]
          },
    },
    "id": "1861456194068186"
  },
  "id": "https://likethatwords.com/blind-and-visually-impaired-people-react-to-our-video/"
}
/**/

function generateReportB1(form) {
  var endpoint = getApiEndpointForFormInputs(form);
  var respData = FB.api(endpoint);

  if (respData.instant_article !== undefined && respData.instant_article.insights) {
    var sheet = clearScratchSheet();

    var columnHeadings = ['Date', 'Value'];
    sheet.appendRow(columnHeadings);

    // Write individual values under the appropriate column heading.
    var results = respData.instant_article.insights.data;
    var range = sheet.getRange(sheet.getLastRow() + 1, 1, results.length, columnHeadings.length);
    range.setValues(results.map(function (result) {
      return [result.time, result.value];
    }));

    sheet.newChart().asLineChart()

    // Render chart.
    var chart = sheet.newChart()
    .asLineChart() //.setChartType(Charts.ChartType.LINE)
    .addRange(range)
    .setPosition(1, 3, 5, 5)
    //.setOption('animation.duration', 300)
    .setOption('legend', {position: 'bottom', textStyle: {color: 'blue', fontSize: 14}})
    .setOption('title', 'Daily Views: ' + respData.id)
    .build();
    sheet.insertChart(chart);
  }
}

function generateReportB1a(form) {
  var endpoint = getApiEndpointForFormInputs(form);
  var respData = FB.api(endpoint);

  if (respData.instant_article !== undefined && respData.instant_article.insights) {
    var sheet = clearScratchSheet();

    var columnHeadings = ['Canonical URL', 'Value'];
    sheet.appendRow(columnHeadings);

    // Sum up all the views in the given date range for the URL.
    var total = 0;
    var results = respData.instant_article.insights.data;
    results.map(function (result) {
      total += parseInt(result.value);
    });

    var range = sheet.getRange(
      sheet.getLastRow() + 1, // row
      1,                      // col
      1,                      // numRows
      columnHeadings.length   // numCols
    );
    range.setValues([
      [respData.id, total]
    ]);

    sheet.newChart().asLineChart()

    // Render chart.
    var chart = sheet.newChart()
    .asLineChart() //.setChartType(Charts.ChartType.LINE)
    .addRange(range)
    .setPosition(1, 3, 5, 5)
    //.setOption('animation.duration', 300)
    .setOption('legend', {position: 'bottom', textStyle: {color: 'blue', fontSize: 14}})
    .setOption('title', 'Total Views for Range')
    .build();
    sheet.insertChart(chart);
  }
}

////////////////////////////////////////////////////////////////////////////////

/** /
// /{page-id}?fields=instant_articles{development_mode,publish_status,published,id,canonical_url}
{
  "instant_articles": {
    "data": [
      {
        "development_mode": false,
        "publish_status": "LIVE",
        "published": true,
        "id": "620367541486691",
        "canonical_url": "http://news.sky.com/story/malaysians-banned-from-leaving-north-korea-over-kim-jong-nam-murder-10793259"
      }
    ],
    "paging": {
      "cursors": {
        "before": "NjIwMzY3NTQxNDg2Njkx",
        "after": "OTI3MjQ0NTg3NDExODg5"
      },
      "next": "https://graph.facebook.com/v2.7/164665060214766/instant_articles?access_token=EAACEdEose0cBAIFHvZCLFRiWtGC6AZCIxS0d02G6GhXhiHibJ8nyp15YuNK2mSAKghJRgnUZCmWcXLEwS6Dss23aWRE40HebCH6hZAB8JZBCFyt4AiFOZAyFUSgl5zJe6CdGxb9iL3kkOiZCGujvpx5OgnqHScUR2g0bYBQOJSB1j6tFrCxgtS0&pretty=0&fields=development_mode%2Cpublish_status%2Cpublished%2Cid%2Ccanonical_url&limit=25&after=OTI3MjQ0NTg3NDExODg5"
    }
  },
  "id": "164665060214766"
}
/**/



////////////////////////////////////////////////////////////////////////////////

function clearScratchSheet() {
  var scratchSheetName = 'Report';

  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadsheet.getSheets()[0];

  sheet.setName(scratchSheetName);
  sheet.setTabColor(null);
  sheet.protect().setWarningOnly(true).setDescription('Auto-generated Data');

  // Clear everything from the sheet.
  sheet.getCharts().map(function (chart) {
    log(chart);
    // Unknown error caused by chart to be an empty object (`{}`).
    //sheet.removeChart(chart);
  });
  sheet.clear();

  return sheet;
}














////////////////////////////////////////////////////////////////////////////////

function generateReportNO(endpoint) {
  var respData = FB.api(endpoint);

  // The first response won't have a "prev" paged result.
  if (respData.paging && respData.paging.prev === undefined) {
    //clear sheet
    //init sheet
  }

  //if (formInputs.scope === 'aggregate') {}
  //var data = JSON.parse(resp);
  //var results = data.instant_articles_insights.data
  if (respData.instant_articles_insights !== undefined) {
    //updateSheetWithResults(respData.instant_articles_insights, formInputs.metric);
    updateSheetWithResults(respData.instant_articles_insights, 'all_views');
  } else if (respData.instant_article !== undefined) {
    updateSheetWithResults(respData.instant_article, formInputs.metric);
  }

  // Paged results.
  if (respData.paging.next) {
    log('PAGED RESP');
    generateReport(respData.paging.next);
  } else {
    log('DONE')
  }
}

function updateSheetWithResultsNO(results, metric) {
  clearSheet();

  var results = results.data;

  //if (form.metric === '' && form.scope === 'single') { }

  var columnHeadings = props[metric].columnHeadings;
  sheet.appendRow(columnHeadings);

  // Write individual values under the appropriate column heading.
  var range = sheet.getRange(sheet.getLastRow() + 1, 1, results.length, columnHeadings.length);
  range.setValues(results.map(function (result) {
    return [result.time, result.value];
  }));

  // Render chart.
  var chart = sheet.newChart()
  .setChartType(props[metric].chartType)
  .addRange(range)
  .setPosition(props[metric].chartPosition[0], props[metric].chartPosition[1], props[metric].chartPosition[2], props[metric].chartPosition[3])
  //.setOption('animation.duration', 300)
  .setOption('legend', {position: 'bottom', textStyle: {color: 'blue', fontSize: 14}})
  .setOption('title', props[metric].chartTitle)
  .build();
  sheet.insertChart(chart);
}
