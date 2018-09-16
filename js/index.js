var bar1 = new ProgressBar.Circle('#progress-container1', {
    color: 'pink',
    trailColor: '#f4f4f4',
    easing: 'easeInOut',
    trailWidth: 0.8,
    strokeWidth: 7,
    svgStyle: {
        display: 'block',
        // Important: make sure that your container has same
        // aspect ratio as the SVG canvas. See SVG canvas sizes above.
        width: '100%'
    },
    text: {
        // Initial value for text.
        // Default: null
        value: 'Text',

        // Class name for text element.
        // Default: 'progressbar-text'
        className: 'progressbar__label',

        // Inline CSS styles for the text element.
        // If you want to modify all CSS your self, set null to disable
        // all default styles.
        // If the style option contains values, container is automatically
        // set to position: relative. You can disable behavior this with
        // autoStyleContainer: false
        // If you specify anything in this object, none of the default styles
        // apply
        // Default: object speficied below
        style: {
            // Text color.
            // Default: same as stroke color (options.color)
            color: '#eee',
            position: 'absolute',
            left: '50%',
            top: '50%',
            padding: 0,
            margin: 0,
            // You can specify styles which will be browser prefixed
            transform: {
                prefix: true,
                value: 'translate(-50%, -50%)'
            }
        },

        // Only effective if the text.style is not null
        // By default position: relative is applied to container if text
        // is set. Setting this to false disables that feature.
        autoStyleContainer: true,

        // Only effective if the shape is SemiCircle.
        // If true, baseline for text is aligned with bottom of
        // the SVG canvas. If false, bottom line of SVG canvas
        // is in the center of text.
        // Default: true
        alignToBottom: true
    },

    // Fill color for the shape. If null, no fill.
    // Default: null
    // fill: 'rgba(a, a, a, 0.5)',

    // Duration for animation in milliseconds
    // Default: 800
    duration: 1200,

    // Easing for animation. See #easing section.
    // Default: 'linear'
    easing: 'easeOut',

    // See #custom-animations section
    // Built-in shape passes reference to itself and a custom attachment
    // object to step function
    from: {color: '#FFEA82'},
    to: {color: '#ED6A5A'},
    step: function (state, circle, attachment) {
        circle.path.setAttribute('stroke', state.color);
        circle.setText(Math.round(circle.value() * 100) + ' %');

    },

    // If true, some useful console.warn calls will be done if it seems
    // that progressbar is used incorrectly
    // Default: false
    warnings: false


});
bar1.animate(.7);

// var bar2 = new ProgressBar.Circle('#progress-container2', {
//     color: 'pink',
//     trailColor: '#f4f4f4',
//     easing: 'easeInOut',
//     trailWidth: 0.8,
//     strokeWidth: 5,
//     svgStyle: {
//         display: 'block',
//         // Important: make sure that your container has same
//         // aspect ratio as the SVG canvas. See SVG canvas sizes above.
//         width: '100%'
//     },
//     text: {
//         // Initial value for text.
//         // Default: null
//         value: 'Text',
//
//         // Class name for text element.
//         // Default: 'progressbar-text'
//         className: 'progressbar__label',
//
//         // Inline CSS styles for the text element.
//         // If you want to modify all CSS your self, set null to disable
//         // all default styles.
//         // If the style option contains values, container is automatically
//         // set to position: relative. You can disable behavior this with
//         // autoStyleContainer: false
//         // If you specify anything in this object, none of the default styles
//         // apply
//         // Default: object speficied below
//         style: {
//             // Text color.
//             // Default: same as stroke color (options.color)
//             color: '#eee',
//             position: 'absolute',
//             left: '50%',
//             top: '50%',
//             padding: 0,
//             margin: 0,
//             // You can specify styles which will be browser prefixed
//             transform: {
//                 prefix: true,
//                 value: 'translate(-50%, -50%)'
//             }
//         },
//
//         // Only effective if the text.style is not null
//         // By default position: relative is applied to container if text
//         // is set. Setting this to false disables that feature.
//         autoStyleContainer: true,
//
//         // Only effective if the shape is SemiCircle.
//         // If true, baseline for text is aligned with bottom of
//         // the SVG canvas. If false, bottom line of SVG canvas
//         // is in the center of text.
//         // Default: true
//         alignToBottom: true
//     },
//
//     // Fill color for the shape. If null, no fill.
//     // Default: null
//     // fill: 'rgba(a, a, a, 0.5)',
//
//     // Duration for animation in milliseconds
//     // Default: 800
//     duration: 1200,
//
//     // Easing for animation. See #easing section.
//     // Default: 'linear'
//     easing: 'easeOut',
//
//     // See #custom-animations section
//     // Built-in shape passes reference to itself and a custom attachment
//     // object to step function
//     from: {color: '#FFEA82'},
//     to: {color: '#ED6A5A'},
//
//     step: function (state, circle, attachment) {
//         circle.setText(Math.round(circle.value() * 100) + ' %');
//         circle.path.setAttribute('stroke', state.color);
//     },
//
//     // If true, some useful console.warn calls will be done if it seems
//     // that progressbar is used incorrectly
//     // Default: false
//     warnings: false
//
//
// });
// bar2.animate(.7);