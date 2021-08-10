/**
 * A Service Locator.
 *
 * Used to register and resolve dependency in a recursive manner.
 * @class ServiceLocator
 * @constructor
 */

declare class ServiceLocator extends Error {
  register: (dependencyName: string, constructor: any) => void
  dependencyMap: any
  get: (dependencyName: string) => any
  dependencyCache: any
  getAll: () => any
  clear: () => void
  constructor();
}

function ServiceLocator(this: any) {
  this.dependencyMap = {}
  this.dependencyCache = {}
}

/**
 * Adds a dependency to the container.
 *
 * @method register
 * @param  {String}   dependencyName The dependency name
 * @param  {Function} constructor    The function used for initially instantiating the dependency.
 * @return {void}
 */
ServiceLocator.prototype.register = function register(
  dependencyName: string,
  constructor: any
) {
  if (typeof constructor !== 'function') {
    throw new Error(
      `${dependencyName}: Dependency constructor is not a function`
    )
  }

  if (!dependencyName) {
    throw new Error('Invalid dependency name provided')
  }

  this.dependencyMap[dependencyName] = constructor
}

/**
 * Resolves and returns the dependency requested.
 *
 * @method get
 * @param  {string} dependencyName The name of the dependency to resolve.
 * @return {mixed}                 The resolved dependency
 */
ServiceLocator.prototype.get = function get(dependencyName: string) {
  if (this.dependencyMap[dependencyName] === undefined) {
    throw new Error(
      `${dependencyName}: Attempting to retrieve unknown depdency`
    )
  }

  if (this.dependencyCache[dependencyName] === undefined) {
    const dependencyConstructor = this.dependencyMap[dependencyName]
    const dependency = dependencyConstructor(this)
    if (dependency) {
      this.dependencyCache[dependencyName] = dependency
    }
  }

  return this.dependencyCache[dependencyName]
}

/**
 * Retrieves an object containing the dependency name as the key and the resolved dependency
 * as the object. This object contains all dependencies registered in this container.
 *
 * @method getAll
 * @return {Array} Contain all the dependencies registered in this container after being resolved.
 */
ServiceLocator.prototype.getAll = function getAll() {
  const dependencies = Object.keys(this.dependencyMap)
  dependencies.forEach((key: any) => {
    this.get(dependencies[key])
  })

  return this.dependencyCache
}

/**
 * Clears all the dependencies from this container and from the cache.
 * @method clear
 * @return {void}
 */
ServiceLocator.prototype.clear = function clear() {
  this.dependencyCache = {}
  this.dependencyMap = {}
}

export const serviceLocator = new ServiceLocator()
