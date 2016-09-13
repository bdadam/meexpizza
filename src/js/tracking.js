if (!window.ga) {
    if (location.hostname !== 'localhost') {
        (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
        (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
        m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
        })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
    } else {
        window.ga = (...args) => { console.log(args); };
    }
}

export const pageview = () => {
  ga('create', 'UA-73703688-1', 'auto');
  ga('send', 'pageview');
};
