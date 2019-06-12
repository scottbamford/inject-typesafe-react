import * as React from 'react';
import { IServiceProvider } from 'inject-typesafe';
import { InjectContext } from "./InjectContext";

/**
 * Inject a value from the InjectContext's IServiceProvider.
 * 
 * Each call to useInjected() creates its own scope with [[IServiceProvider.createScope()]].  If you want to provide more than one service within the same scope,
 * consider returning multiple values from a single call e.g.:
 *      const { a, b } = useInjected(services => { a: services.a(), b: services.b() });
 * 
 * Please be careful when using this that you don't end up using it as a service locator and loosing the benefits of constructor/props based dependency injection.
 * Consider use of withInjectedProps() HOC if you want to ensure all dependencies are props of your component.
 * @param Container
 * @param props
 */
export function useInjected<T = any, ServiceCollection = any>(resolve: (services: ServiceCollection) => T): T {
    let serviceProvider = React.useContext(InjectContext);
    if (!serviceProvider) {
        throw 'You must include a parent <InjectContext.Provider> in your component tree to use the withInjectedProps HOC or useInjected() hook.'
    }

    // Each injection takes place as a seperate scope.
    let scope = serviceProvider.createScope();

    return resolve(scope.services());
}
