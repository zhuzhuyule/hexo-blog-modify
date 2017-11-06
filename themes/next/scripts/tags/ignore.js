/* global hexo */
// Usage: {% ignore %} Something {% endignore %}

function ignore (args, content) {
  return content;
}

hexo.extend.tag.register('ignore', ignore, {ends: true});
hexo.extend.tag.register('ig', ignore, {ends: true});
