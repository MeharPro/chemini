import React, { useEffect, useRef } from 'react';
import { animate, stagger } from 'animejs';

const Loader = () => {
    const loaderRef = useRef(null);

    useEffect(() => {
        const targets = loaderRef.current.querySelectorAll('.dot');

        // Ensure targets exist
        if (!targets.length) return;

        const animation = animate(targets, {
            translateY: [
                { to: -10, duration: 400, easing: 'outQuad' },
                { to: 0, duration: 400, easing: 'inQuad' }
            ],
            backgroundColor: [
                { to: '#4285f4', duration: 400 },
                { to: '#d96570', duration: 400 },
                { to: '#9b72cb', duration: 400 },
                { to: '#4285f4', duration: 400 }
            ],
            delay: stagger(150),
            loop: true
        });

        return () => animation.pause();
    }, []);

    return (
        <div className="loader-container" ref={loaderRef}>
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
        </div>
    );
};

export default Loader;
