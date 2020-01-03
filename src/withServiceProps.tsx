import * as React from 'react';
import { IServiceProvider } from 'inject-typesafe';
import { ServiceProviderContext } from "./ServiceProviderContext";

/**
 * Create a HOC that injects services into props via the mapToServices function from a scope under the ServiceProviderContext's provider.
 * 
 * This has been designed to feel similar to Redux's connect() HOC.
 * @param Container
 * @param props
 */
export function withServiceProps<PropTypes = any, ServiceCollection = any>(mapToServices: (services: ServiceCollection) => Partial<PropTypes>): ((component: React.ComponentType<any>) => any) {
    var wrapper = (Component: React.ComponentType<any>) => {
        class WithServiceProps extends React.Component<Partial<PropTypes>> {
            static displayName = `withServiceProps(${getDisplayName(Component)})`;

            render() {
                let serviceProvider = this.context as IServiceProvider;
                if (!serviceProvider) {
                    throw 'You must include a parent <ServiceProviderContext.Provider> in your component tree to use the withServiceProps HOC or useServices() hook.'
                }

                // Each injection takes place as a seperate scope.
                let scope = serviceProvider.createScope();

                // Call the mapToServices method to map the service to the props.
                let injected = mapToServices(scope.services());

                let { ...rest } = this.props;

                return (<Component {...injected} {...rest} />);
            }
        };

        WithServiceProps.contextType = ServiceProviderContext;

        return WithServiceProps;
    };

    return wrapper;
}


/**
 * Returns the display name of React component.
 * @param Component
 */
function getDisplayName(Component: any): string {
    return (
        Component.displayName ||
        Component.name ||
        (typeof Component === 'string' && Component.length > 0
            ? Component
            : 'Unknown')
    );
}
