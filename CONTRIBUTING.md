# Contributing

### Software Architecture

* Prefer convention to configuration
* Prefer interfaces to composition
* Prefer composition to inheritance
* Prever the simplest robust solution
* Prefer self-hosted-ness
* Ruthlessly factor out orthogonal functionality
* Ruthlessly simplify architecture
* Prefer the solution with the least code
* Prefer defaults and conventions whenever they are clear

### Stylesheets

 * Give every react component a CSS class name that's equal to its component name (i.e. `<FooView className='FooView' />`)
 * Give react components additional styles by adding additional lowercase class names (i.e. `<FooView className='FooView green' />`)
 * Prefer global class definitions (i.e. `.green {...}`) to scoped class definitions (i.e. `.FooView.green {...}`)
