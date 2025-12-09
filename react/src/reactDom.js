import React from './react';

function createRoot(container) {
    return {
        render(element) {
            React.render(element, container);
        }
    }
}

export default createRoot;