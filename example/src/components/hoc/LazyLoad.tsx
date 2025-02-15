import React, { Suspense } from "react";

export const LazyLoad = (importFunc) => {
    const LazyComponent = React.lazy(importFunc);
    return (props) => (
        <Suspense fallback={<div>Loading...</div>}>
            <LazyComponent {...props} />
        </Suspense>
    );
};