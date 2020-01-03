import * as React from 'react';
import { IServiceProvider } from 'inject-typesafe';
import { ServiceProviderContext } from "./ServiceProviderContext";

/**
 * Inject a services from the ServiceProviderContext's IServiceProvider.
 * 
 * Each call to useServices() creates its own scope with [[IServiceProvider.createScope()]].  If you want to provide more than one service within the same scope,
 * consider returning multiple values from a single call e.g.:
 *      const { a, b } = useInjected(services => { a: services.a(), b: services.b() });
 * 
 * Please be careful when using this that you don't end up using it as a service locator and loosing the benefits of constructor/props based dependency injection.
 * Consider use of withServiceProps() HOC if you want to ensure all dependencies are props of your component.
 */
export function useServices<T = any, ServiceCollection = any>(resolve: (services: ServiceCollection) => T, deps: Array<any> = []): T {
    let serviceProvider = React.useContext(ServiceProviderContext);

    // Resolve the services and store the results using useMemo to optimise rendering.
    return React.useMemo(() => {
        if (!serviceProvider) {
            throw 'You must include a parent <ServiceProviderContext.Provider> in your component tree to use the withServiceProps HOC or useServices() hook.'
        }

        // Each injection takes place as a seperate scope.
        let scope = serviceProvider.createScope();

        return resolve(scope.services());
    }, [serviceProvider, ...deps]);
}
