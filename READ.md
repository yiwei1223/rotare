# rotare.js
A Javascript(AMD, node)module realization draw runner


#API
	1）loading method achieve the page load performance
	   window.rotare.start(config{}, callback);
#Example Usage

	window.rotare.start({
        time: 3500,
        direction: 'left',
        categoryOrigin: '.runner-disk',
        animateTo: [20, 60],
        random: [10, 15],
        loops: 5,
        easing: 'cubic-bezier(0.42,0,0.58,1)',
        reset: false
    }, function () {
        //do something
    });

#Last
if you have some prombles when use,you can see the demo files!!!