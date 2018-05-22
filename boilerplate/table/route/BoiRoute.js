// ${addRoute no delete!}
    '/${lowerPageName}': {
      component: dynamicWrapper(app, ['${lowerTableName}'], () => import('../routes/${upperPageName}/index')),
    },
