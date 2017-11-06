/* global hexo */ //console.log()
// Class: default, primary, success, info, warning, danger
// Usage: {% quotelist %} Something {% endquotelist %} 
// Alias: {% qlist %} Something {% endqlist %} 

function quotelist(args, content) {
  args = args.join(' ').split(',');
  var title = args[0] || '  参考资料  ';
  if (title == '-') {
    title = '';
  } else {
    title = '<div style="text-align: center;"><i class="fa fa-snowflake-o fa-spin" aria-hidden="true"></i><span> ' + title + ' </span><i class="fa fa-snowflake-o fa-spin" aria-hidden="true"></i></div>';
  }

  var vStr = hexo.render.renderSync({
    text: content,
    engine: 'markdown'
  });


  vStr = vStr.replace(/<p>/g, "<ul><li>");
  vStr = vStr.replace(/<\/p>/g, "</li></ul>");
  vStr = vStr.replace(/<br>/g, "</li><li>");
  vStr = vStr.replace(/<li>(.*?)(<a.*?>).*?<\/a>/g, "<li>$2 $1</a>");
  return '<div class="blockquote-list">' +
    title +
    vStr +
    '</div>';
}

// fa-gg

hexo.extend.tag.register('quotelist', quotelist, {
  ends: true
});
hexo.extend.tag.register('qlist', quotelist, {
  ends: true
});


// var quotes = vStr.match(/<.?[pr]>.*?<a.*?<\/a>/g);
// if (quotes != undefined) {
//   var quotesArr = [];
//   for (var i = 0; i < quotes.length; i++) {
//     var raw = quotes[i];
//     quotesArr.push(raw);
//     console.log(raw);
//     var val = raw.match(/>(.*?)(<a.*?<\/a)/g);
//     console.log(val[1], val[2]);
//   };
//   console.log(quotesArr);
// }
