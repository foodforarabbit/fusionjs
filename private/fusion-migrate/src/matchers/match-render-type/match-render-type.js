const composeVisitors = require('../../utils/compose-visitors.js');
const visitNamedModule = require('../../utils/visit-named-module.js');

module.exports = state => () => {
  const isorenderVisitor = visitNamedModule({
    packageName: '@uber/isorender',
    refsHandler: (t, s, refPaths) => {
      const refPath = refPaths.find(p => p.parentPath.type === 'NewExpression');
      if (refPath) {
        state.renderType = 'isorender';
      }
    },
  });
  const pageSkeletonVisitor = visitNamedModule({
    packageName: '@uber/render-page-skeleton',
    refsHandler: (t, s, refPaths) => {
      const refPath = refPaths.find(
        p => p.parentPath.type === 'CallExpression'
      );
      if (refPath) {
        state.renderType = 'renderPageSkeleton';
        state.pageSkeletonConfig = refPath.parent.arguments[1];
      }
    },
  });
  return {
    name: 'match-render-type',
    visitor: composeVisitors(pageSkeletonVisitor, isorenderVisitor),
  };
};
