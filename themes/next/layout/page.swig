{% extends '_layout.swig' %}
{% import '_macro/sidebar.swig' as sidebar_template %}

  {% block title %}{#
  #}{% set page_title_suffix = ' | ' + config.title %}{#

  #}{% if page.type === "categories" and not page.title %}{#
    #}{{ __('title.category') + page_title_suffix }}{#
  #}{% elif page.type === "tags" and not page.title %}{#
    #}{{ __('title.tag') + page_title_suffix }}{#
  #}{% else %}{#
    #}{{ page.title + page_title_suffix }}{#
  #}{% endif %}{#
#}{% endblock %}

{% block page_class %}page-post-detail{% endblock %}

{% block content %}

  <div id="posts" class="posts-expand">
    {##################}
    {### PAGE BLOCK ###}
    {##################}
    <div class="post-block page">
      {% include '_partials/page-header.swig' %}
      {#################}
      {### PAGE BODY ###}
      {#################}
      <div class="post-body{% if theme.han %} han-init-context{% endif %}{% if page.direction && page.direction.toLowerCase() === 'rtl' %} rtl{% endif %}">
        {# tagcloud page support #}
        {% if page.type === "tags" %}
          <div class="tag-cloud">
            <div class="tag-cloud-title">
                {{ _p('counter.tag_cloud', site.tags.length) }}
            </div>
      <link href="../lib/tag3dCloud/tagcloud.css" rel="stylesheet" type="text/css">
        <div id="tag-cloud" class="tag-cloud-tags">
          {{ tagcloud({min_font: 12, max_font: 30, amount: 200, color: true, start_color: '#ccc', end_color: '#111'}) }}
        </div>
        <div id="tag-cloud3d">          
        </div>

      
      </div>


      <script type="text/javascript" src="/lib/jquery/index.js"></script>
      <script type="text/javascript" >
       $(document).ready(
          function() {
              var entries = [];
              $('#tag-cloud').find('ul').children('li').each(function() {
                  var $tagsInfo = $($(this).html());
                  $tagsInfo.children('span').remove();
                  var item = { label: $tagsInfo.text(), url: $tagsInfo.attr('href') }
                  entries.push(item);
              });

              var settings = {
                  entries: entries,
                  width: 350,
                  height: 350,
                  radius: '65%',
                  radiusMin: 35,
                  bgDraw: false,
                  //bgColor: '#F9F9F9',
                  opacityOver: 1.00,
                  opacityOut: 0.05,
                  opacitySpeed: 6,
                  fov: 800,
                  speed: 0.8,
                  fontFamily: 'Oswald, Arial, sans-serif',
                  fontSize: '15',
                  fontColor: '#000',
                  fontWeight: 'normal', //bold
                  fontStyle: 'normal', //italic 
                  fontStretch: 'condensed', //wider, narrower, ultra-condensed, extra-condensed, condensed, semi-condensed, semi-expanded, expanded, extra-expanded, ultra-expanded
                  fontToUpperCase: false
              };
              $('#tag-cloud3d').svg3DTagCloud(settings);
          }
      );
      </script>
        {% elif page.type === 'categories' %}
          <div class="category-all-page">
            <div class="category-all-title">
                {{ _p('counter.categories', site.categories.length) }}
            </div>
            <div class="category-all">
              {{ list_categories() }}
            </div>
          </div>
        {% else %}
          {{ page.content }}
        {% endif %}
      </div>
      {#####################}
      {### END PAGE BODY ###}
      {#####################}
    </div>
    {######################}
    {### END PAGE BLOCK ###}
    {######################}
  </div>

{% endblock %}

{% block sidebar %}
  {{ sidebar_template.render(false) }}
{% endblock %}
