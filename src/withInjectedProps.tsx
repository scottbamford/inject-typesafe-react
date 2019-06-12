import * as React from 'react';
import { IServiceProvider } from 'inject-typesafe';
import { InjectContext } from "./InjectContext";

/**
 * Create a HOC that injects services into props via the mapToServices function from a scope under the InjectContext's provider.
 * 
 * This has been designed to feel similar to Redux's connect() HOC.
 * @param Container
 * @param props
 */
export function withInjectedProps<PropTypes = any, ServiceCollection = any>(mapToServices: (services: ServiceCollection) => Partial<PropTypes>): ((component: React.ComponentType<any>) => any) {
    var wrapper = (Component: React.ComponentType<any>) => {
        class WithInjectedProps extends React.Component<Partial<PropTypes>> {
            static displayName = `withInjectedProps(${getDisplayName(Component)})`;

            render() {
                let serviceProvider = this.context as IServiceProvider;
                if (!serviceProvider) {
                    throw 'You must include a parent <InjectContext.Provider> in your component tree to use the withInjectedProps HOC or useInjected() hook.'
                }

                // Each injection takes place as a seperate scope.
                let scope = serviceProvider.createScope();

                // Call the mapToServices method to map the service to the props.
                let injected = mapToServices(scope.services());

                let { ...rest } = this.props;

                return (<Component {...injected} {...rest} />);
            }
        };

        WithInjectedProps.contextType = InjectContext;

        return WithInjectedProps;
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
