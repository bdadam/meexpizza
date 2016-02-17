document.registerElement('google-map', {
    extends: 'a',
    prototype: Object.create(HTMLElement.prototype, {
        attachedCallback: {
            value: function() {
                var el = this;
                setTimeout(() => {
                    // 47.785625, 19.932675
                    const width = el.clientWidth | 0;

                    if (width === 0) { return; }

                    const height = width * 0.75 | 0;
                    const scale = (window.devicePixelRatio > 1) ? 2 : 1;
                    const staticMapUrl = `https://maps.googleapis.com/maps/api/staticmap?zoom=15&size=${width}x${height}&scale=${scale}&maptype=roadmap&markers=color:blue%7Clabel:M%7C3200+Gyöngyös,+Orczy+út+1.&format=png&key=AIzaSyCv-L_Za8GWc4L_s4hcVX3frfJm5toJc6k`;
                    const img = document.createElement('img');
                    img.alt = el.getAttribute('title');
                    img.src = staticMapUrl;
                    el.insertBefore(img, el.firstChild);
                });
            }
        }
    })
});
