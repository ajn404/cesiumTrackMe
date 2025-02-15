import React, { Suspense } from "react";

export const LazyLoad = (Component) => {
    const LazyComponent = React.lazy(() => import(`./${Component}`));
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <LazyComponent />
        </Suspense>
    );
};