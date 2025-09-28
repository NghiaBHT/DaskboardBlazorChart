window.echartsInterop = {
  _charts: {},
  init: function (elementId, options) {
    const el = document.getElementById(elementId);
    if (!el) return;
    const chart = echarts.init(el);
    chart.setOption(options || {});
    this._charts[elementId] = chart;
  },

  setOptions: function (elementId, options, notMerge) {
    const chart = this._charts[elementId];
    if (!chart) return;
    chart.setOption(options || {}, notMerge === true);
  },

  resize: function (elementId) {
    const chart = this._charts[elementId];
    if (chart) chart.resize();
  },

  dispose: function (elementId) {
    const chart = this._charts[elementId];
    if (chart) {
      chart.dispose();
      delete this._charts[elementId];
    }
  },

  // register a geoJSON map object already loaded in JS
  registerMap: function (name, geoJson) {
    if (!echarts || !name || !geoJson) return;
    echarts.registerMap(name, geoJson);
  },

  // fetch geoJSON from URL and register
  registerMapFromUrl: async function (name, url) {
    if (!echarts || !name || !url) return;
    try {
      const resp = await fetch(url);
      if (!resp.ok) {
        throw new Error(`HTTP error! status: ${resp.status}`);
      }
      const geoJson = await resp.json();
      echarts.registerMap(name, geoJson);
      console.log(`Map '${name}' registered successfully from ${url}`);
    } catch (e) {
      console.error("registerMapFromUrl error:", e);
    }
  }
};

// global resize to handle all charts on window resize
window.addEventListener('resize', function () {
  try {
    Object.keys(window.echartsInterop._charts || {}).forEach(function (key) {
      const c = window.echartsInterop._charts[key];
      if (c && c.resize) c.resize();
    });
  } catch (e) { /* ignore */ }
});