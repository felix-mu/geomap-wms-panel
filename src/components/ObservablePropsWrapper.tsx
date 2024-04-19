import React, { Component, ReactNode } from 'react';
import { Observable, Unsubscribable } from 'rxjs';

interface Props<T> {
  watch: Observable<T>;
  child: React.ComponentType<T>;
  initialSubProps: T;
  children?: ReactNode;
}

interface State<T> {
  subProps: T;
}

export class ObservablePropsWrapper<T> extends Component<Props<T>, State<T>> {
  sub?: Unsubscribable;

  constructor(props: Props<T>) {
    super(props);
    this.state = {
      subProps: props.initialSubProps,
    };
  }

  componentDidMount() {
    this.sub = this.props.watch.subscribe({
      next: (subProps: T) => {
        //console.log('ObservablePropsWrapper:NEXT', subProps);
        this.setState({ subProps });
      },
      complete: () => {
        //console.log('ObservablePropsWrapper:complete');
      },
      error: (err) => {
        //console.log('ObservablePropsWrapper:error', err);
      },
    });
  }

  componentWillUnmount() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  render() {
    const { subProps } = this.state;
    const ChildComponent = this.props.child; // Store the child component in a variable
    return <ChildComponent {...subProps}>{this.props.children}</ChildComponent>;
  }
}
