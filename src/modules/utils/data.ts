import _ from 'lodash';

/**
 * A utility class for working with data objects.
 */
class DataUtils {
    private data: object;

    /**
     * Creates a new instance of the DataUtils class.
     * @param data - The initial data object.
     * @example
     * const dataUtils = new DataUtils({ foo: 'bar' });
     */
    constructor(data: object) {
        this.data = data;
    }

    /**
     * Gets the value at the specified path in the data object.
     * @param path - The path to the value.
     * @param defaultValue - The default value to return if the path is not found.
     * @returns The value at the specified path, or the default value if not found.
     * @example
     * const value = dataUtils.get('foo'); // 'bar'
     * const anotherValue = dataUtils.get('baz', 'default'); // 'default'
     */
    get(path: string, defaultValue?: unknown): unknown {
        const value = _.get(this.data, path, defaultValue);
        console.log(value);
        return value;
    }

    /**
     * Sets the value at the specified path in the data object.
     * @param path - The path to set the value at.
     * @param value - The value to set.
     * @example
     * dataUtils.set('foo', 'baz');
     * console.log(dataUtils.get('foo')); // 'baz'
     */
    set(path: string, value: unknown): void {
        _.set(this.data, path, value);
    }

    /**
     * Finds the first element in a collection that satisfies the given iteratee.
     * @param collection - The collection to search.
     * @param iteratee - The iteratee function or object to match against.
     * @returns The first element that satisfies the iteratee, or undefined if not found.
     * @example
     * const users = [
     *   { 'user': 'barney', 'age': 36, 'active': true },
     *   { 'user': 'fred',   'age': 40, 'active': false },
     *   { 'user': 'pebbles','age': 1,  'active': true }
     * ];
     *
     * const youngUser = dataUtils.find(users, { 'age': 1, 'active': true });
     * // => { 'user': 'pebbles', 'age': 1, 'active': true }
     */
    find(collection: object[], iteratee: object | ((value: object) => boolean)): object | undefined {
        const value = _.find(collection, iteratee);
        console.log(value);
        return value;
    }

    /**
     * Returns the underlying data object.
     * @returns The data object.
     * @example
     * const data = dataUtils.value();
     * console.log(data); // { foo: 'baz' }
     */
    value(): object {
        return this.data;
    }
}

export default DataUtils;
