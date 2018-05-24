// ${addRoute no delete!}
    '/${lowerPageName}': {
      component: dynamicWrapper(app, ['${lowerFormName}'], () => import('../routes/${upperPageName}/index')),
    },
