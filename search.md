---
layout: page
title: Search
permalink: /search
---
> Results maybe stale due to delay in google indexing
<script>
  (function() {
    var cx = '{{ site.google.search_engine_id }}';
    var gcse = document.createElement('script');
    gcse.type = 'text/javascript';
    gcse.async = true;
    gcse.src = 'https://cse.google.com/cse.js?cx=' + cx;
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(gcse, s);
  })();
</script>
<gcse:search></gcse:search>
