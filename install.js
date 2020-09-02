const exec = require('child_process').exec;


const runCommand = (command) => {
  console.log(`run command: "${command}"`);
  return (new Promise((resolve, reject) => {
    exec(command, (error, stdout, _stderr) => {
      if (error !== null) reject(error);
      resolve(stdout);
    });
  }))
  .catch((error) => {
    console.log(error.message)
  });
}

const log = (message) => console.log("\n\033[1m\x1b[36m%s\x1b[0m", message);

/**
 * parse submodules list from .gitsubmodules file
 * @param {String} submodulesListRawString
 * @return {Object[]} [{ path, url, branch }, ...]
 */
const parseSubmodulesList = (submodulesListRawString) => {
  let submodulesList = [];
  if(submodulesListRawString) {
    submodulesListRawString
    .split("\n")
    .forEach(submoduleInfo => {
      submoduleInfo = submoduleInfo.split(" ");
      if(submoduleInfo.length != 3) return;
      submodulesList.push({
        path: submoduleInfo[0]+'/',
        url: submoduleInfo[1],
        branch: submoduleInfo[2],
      });
    });
  }
  return submodulesList;
}


/**
 * parse dependencies list from package.json file
 * @param {String} packageJsonRawString
 * @return {String} "dependencies & versions"
 */
const parseDependenciesList = (packageJsonRawString) => {
  let dependenciesObject = {};
  packageJsonRawString
  .replace(/\}\n\{/g, "}-SPLIT-HERE-{")
  .split("-SPLIT-HERE-")
  .forEach(fileString => {
    const { dependencies, devDependencies } = JSON.parse(fileString);

    dependenciesObject = { ...dependenciesObject, ...dependencies };
    if (!["production", "staging"].includes(process.env.NODE_ENV)) {
      dependenciesObject = { ...dependenciesObject, ...devDependencies };
    }
  });

  return Object.keys(dependenciesObject).map(name => {
    const version = dependenciesObject[name];
    return `${name}@${version}`;
  }).join(" ");
}


/**
 * gather submodules & dependencies from .gitsubmodules & package.json at given path
 * then parse, format & return respective lists of submodules & dependencies
 * @param {String} path submodule fs path
 */
const gather = async (path) => {
  log(`Gather list of submodules & dependencies for ${path}`);
  const gitsubmodules = await runCommand(`cat ${path}.gitsubmodules`);
  const packageJson = await runCommand(`cat ${path}package.json`);

  return [
    parseSubmodulesList(gitsubmodules),
    parseDependenciesList(packageJson),
  ];
}


/**
 * @description backup before install to avoid polluting package.json
 * @note This step is important because 'yarn add' will automatically
 * add the dependencies in the local package.json, thus polluting
 * it with all submodules' dependencies.
 */
const backupOriginalPackageJson = async () => {
  log("Backup package.json");
  await runCommand(`cp package.json og_package.json`);
}


/**
 * restore original package.json and delete backup
 */
const restoreOriginalPackageJson = async () => {
  log("Restore original package.json");
  await runCommand(`rm package.json && mv og_package.json package.json`);
}


/**
 * yarn install dependencies without polluting package.json
 * @param {String} dependencies string returned by gather()
 */
const installDependencies = async (dependencies) => {  
  log("Install dependencies");
  await runCommand(`yarn add ${dependencies}`);
}


/**
 * clone submodule with given path, git url & branch
 * @param {Object} submodule { path, url, branch } from array returned by gather()
 */
const cloneSubmodule = async (submodule) => {
  log(`Clone new submodule ${submodule.path}`);
  await runCommand(`git clone -b ${submodule.branch} ${submodule.url} ${submodule.path}`);
}


/**
 * update given submodule by git pull latest commits & change branch 
 * @param {Object} submodule { path, url, branch } from array returned by gather()
 */
const updateSubmodule = async (submodule) => {
  log(`Update ${submodule.path}`);
  await runCommand(`cd ${submodule.path} && git fetch${submodule.branch ? " && git checkout "+submodule.branch : ""} && git pull`);
}


/**
 * recursively clone all submodules & install all dependencies
 * @param {Object} parentModule { path, url, branch } from array returned by gather()
 */
const init = async (parentModule) => {
  if(SKIP != "subs") await updateSubmodule(parentModule);
  const [childModules, dependencies] = await gather(parentModule.path);

  if(SKIP != "deps") await installDependencies(dependencies);

  for(const childModule of childModules) {
    childModule.path = parentModule.path ? `${parentModule.path}${childModule.path}` : childModule.path;
    if(SKIP != "subs") await cloneSubmodule(childModule)
    await init(childModule);
  };
    
  return;
}


/**
 * --skip subs: do not clone nor update submodules
 * --skip deps: do not installi dependencies
 */
let SKIP = "";
const parseArguments = () => {
  if(process.argv.length > 2 && process.argv[2] === "--skip") {
    SKIP = process.argv[3];
  }
}


(async () => {
  parseArguments();
  await backupOriginalPackageJson();
  await init({ path: "./" });
  await restoreOriginalPackageJson();
})();
