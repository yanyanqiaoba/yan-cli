const path = require('path');
const chalk = require('chalk');
const fs = require('fs-extra');
const child_process = require('child_process');
const exists = require('fs').existsSync;
const inquirer = require('inquirer');

const cwd = process.cwd();
const boilerplateDir = path.join(__dirname, '../boilerplate');


function getPath() {
  if (exists(path.join(cwd, './package.json'))) {
    return 'root';
  }
  if (exists(path.join(cwd, './components'))) {
    return 'src';
  }
  return '';
}

function setTargetPath(callback, type) {

  function q() {
    console.log(chalk.red("you should cd to root or src directory"));
  }

  const currentPath = getPath();

  if (currentPath === 'root' && type) {

    try {
      switch (type) {
        case 'page':
          callback(path.join(cwd, './src/routes/'));
          break;
        case 'component':
          callback(path.join(cwd, './src/components/'));
          break;
        case 'model':
          callback(path.join(cwd, './src/models/'));
          break;
        case 'route':
          callback(path.join(cwd, './src/common/'));
          break;
        default:
          break;
      }
    } catch (e) {
      q();
    }

  } else if (currentPath === 'src' && type) {

    try {
      switch (type) {
        case 'page':
          callback(path.join(cwd, './routes/'));
          break;
        case 'component':
          callback(path.join(cwd, './components/'));
          break;
        case 'model':
          callback(path.join(cwd, './models/'));
          break;
        case 'route':
          callback(path.join(cwd, './common/'));
          break;
        default:
          break;
      }
    } catch (e) {
      q();
    }

  } else {
    q();
  }
}

function normal() {
  const questions = [{
    type: 'list',
    name: 'type',
    message: 'what do you want to generate ?',
    choices: [
      'table',
      'form',
    ],
  }];

  inquirer.prompt(questions).then(function (answers) {
    switch (answers.type) {
      case 'table':
        table();
        break;
      default:
        break;
    }
  });
}

function table() {
  const questionOne = [{
    type: 'input',
    name: 'pageName',
    message: 'input page name which contains a table(eg. myPage):',
  }];
  const questionTwo = [{
    type: 'input',
    name: 'tableName',
    message: 'input page name which contains a table(eg. myTable):',
  }];

  var pageName = 'myPage';
  var tableName = 'myTable';
  var upperTableName = '';
  var lowerTableName = '';
  var upperPageName = '';
  var lowerPageName = '';
  var targetPagePath = '';
  var targetComponentPath = '';

  var copyPagePath = '';
  var copyComPath = '';
  var copyModelPath = '';
  var copyRoutePath = '';

  inquirer.prompt(questionOne)
    .then(function (answerOne) {
      upperPageName = firstUpperFunction(answerOne.pageName);
      lowerPageName = firstLowerFunction(answerOne.pageName);

      setTargetPath(function (targetPage) {
        copyPagePath = targetPage;
        targetPagePath = path.join(copyPagePath,"/",upperPageName);

        fs.access(targetPagePath, function (err) {
          if (!err) {
            console.log(chalk.red(`${targetPagePath} folder already exist`,err));
            return;
          }

          inquirer.prompt(questionTwo)
            .then(function (answerTwo) {
              upperTableName = firstUpperFunction(answerTwo.tableName);
              lowerTableName = firstLowerFunction(answerTwo.tableName);

              setTargetPath(async function(targetCom) {

                copyComPath = targetCom;
                targetComponentPath = path.join(copyComPath,"/",upperTableName);


                fs.access(targetComponentPath, async function (err) {
                  if (!err) {
                    console.log(chalk.red(`${targetComponentPath} folder already exist`,err));
                    return;
                  }

                  // 第一步：拷贝page内容

                  await copyDir(path.join(boilerplateDir, "./table/BoiPage"),copyPagePath);
                  await renameDir(path.join(copyPagePath, "/BoiPage"), targetPagePath);
                  var pagePathTmp = path.join(targetPagePath, "/index.js");
                  var pageData = fs.readFileSync(pagePathTmp,"utf-8");
                  pageData = pageData.replace(/\${upperTableName}/g, upperTableName);
                  pageData = pageData.replace(/\${upperPageName}/g, upperPageName);

                  try {
                    fs.writeFileSync(pagePathTmp, pageData, 'utf8');
                    console.log(chalk.green('generated page success'));
                  } catch (e) {
                    console.log(chalk.red(`generated page fail`, e));
                  }


                  // 第二步：拷贝component内容

                  await copyDir(path.join(boilerplateDir, "./table/component/BoiUserDefinedTable"),copyComPath);
                  await renameDir(path.join(copyComPath, "/BoiUserDefinedTable"), targetComponentPath);
                  var comPathTmp = path.join(targetComponentPath, "/index.js");
                  var tableData = fs.readFileSync(comPathTmp,"utf-8");
                  tableData = tableData.replace(/\${lowerTableName}/g, lowerTableName);
                  tableData = tableData.replace(/\${upperTableName}/g, upperTableName);
                  try {
                    fs.writeFileSync(comPathTmp, tableData, 'utf8');
                    console.log(chalk.green('generated table package success'));
                  } catch (e) {
                    console.log(chalk.red(`generated table package fail`, e));
                  }


                  // 第三步：拷贝model内容
                  setTargetPath(async function (targetModel) {
                    copyModelPath = targetModel;
                    var modelPathTmp = `${copyModelPath}${lowerTableName}.js`;

                    await copyDir(
                      path.join(boilerplateDir, "./table/model/BoiuserDefinedTable.js"),
                      modelPathTmp
                    );
                    var modelData = fs.readFileSync(modelPathTmp,"utf-8");
                    modelData = modelData.replace(/\${lowerTableName}/g, lowerTableName);
                    try {
                      fs.writeFileSync(modelPathTmp, modelData, 'utf8');
                      console.log(chalk.green('generated model success'));
                    } catch (e) {
                      console.log(chalk.red(`generated model fail`, e));
                    }


                    setTargetPath(async function (targetRoute) {
                      // 第四步：追加route内容
                      copyRoutePath = path.join(targetRoute, '/router.js');

                      var routeData = fs.readFileSync(path.join(boilerplateDir, "./table/route/BoiRoute.js"),"utf-8");
                      routeData = routeData.replace(/\${lowerPageName}/g, lowerPageName);
                      routeData = routeData.replace(/\${upperPageName}/g, upperPageName);
                      routeData = routeData.replace(/\${lowerTableName}/g, lowerTableName);


                      var srcRouteData = fs.readFileSync(copyRoutePath,"utf-8");
                      srcRouteData = srcRouteData.replace(/\/\/ \${addRoute no delete!}/g,routeData);
                      try {
                        fs.writeFileSync(copyRoutePath, srcRouteData, 'utf8');
                        console.log(chalk.green('generated routeconfig success'));
                      } catch (e) {
                        console.log(chalk.red(`generated routeconfig fail`, e));
                      }

                    }, 'route');

                  },'model')


                })

              }, 'component');
            })
        });
      },'page');
    });
}

async function copyDir(src, dist) {
  child_process.spawnSync('cp', ['-r', src, dist]);
}

async function renameDir(oldName, newName) {
  child_process.spawnSync('mv', [oldName, newName]);
}


function firstUpperFunction(string) {
  return string.slice(0, 1).toUpperCase() + string.slice(1);
}

function firstLowerFunction(string) {
  return string.slice(0, 1).toLowerCase() + string.slice(1);
}


module.exports = function (args) {
  const name = args[3];
  if (!name) {
    normal();
    return;
  }

  switch (name) {
    case 'table':
      table();
      break;
    default:
      console.log(chalk.red('none of this type'));
      normal();
      break;
  }

};
