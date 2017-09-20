
REPORT_PROPS['aggregate.all_views'] = {

  apiEndpoint: '/{{page-id}}?fields=instant_articles_insights.metric({{metric}}).period(day).since({{rangeStart}}).until({{rangeEnd}})',

  columnHeadings: ['Date', 'Value'],
  chartTitle: 'Total Daily Views',
  chartType: Charts.ChartType.LINE,
  chartPosition: [1, 3, 5, 5],
  chartOptionLegend: {position: 'top', textStyle: {color: 'blue', fontSize: 16}},

  generate: function () {
    //log(this);
    log(this.apiEndpoint.supplant(this.form));
  }
};
