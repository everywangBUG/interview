import React from './React';

function createRoot(container) {
    return {
        render(element) {
            React.render(element, container);
        }
    }
}

export default createRoot;