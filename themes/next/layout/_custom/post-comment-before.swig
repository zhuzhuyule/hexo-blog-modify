  {% if theme.changyan.enable and theme.changyan.appid and theme.changyan.appkey %}
    {% if not is_home() %}
      <div id="cyQing" role="cylabs" data-use="qing"></div>
      <!-- <div id="cyEmoji" role="cylabs" data-use="emoji"></div> -->
    {% endif %}
  {% endif %}

