# Conventions

## Software Architecture

* Prefer convention to configuration
* Prefer interfaces to composition
* Prefer composition to inheritance
* Prefer the simplest robust solution
* Err on the side of solving problems at a lower layer of abstraction
* Ruthlessly factor low cohesion functionality into separate modules
* Ruthlessly simplify architecture
* Prefer the solution with the least code

## Stylesheets

 * Give every react View a CSS class name that's equal to its View name (i.e. `<FooView className='FooView' />`)
 * Give react Views additional styles by adding additional lowercase class names (i.e. `<FooView className='FooView green' />`)
 * Prefer global class definitions (i.e. `.green {...}`) to scoped class definitions (i.e. `.FooView.green {...}`)
