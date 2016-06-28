import cloneDeep from 'lodash.clonedeep';
import isEqual   from 'lodash.isequal';
import set       from 'lodash.set';

import ValidatedQuickForm from './ValidatedQuickForm';

const Auto = parent => class extends parent {
    static Auto = Auto;

    static displayName = `Auto${parent.displayName}`;

    constructor () {
        super(...arguments);

        this.state = {
            ...this.state,

            model:     this.props.model,
            modelSync: this.props.model
        };
    }

    componentWillReceiveProps ({model}) {
        super.componentWillReceiveProps(...arguments);

        if (!isEqual(this.props.model, model)) {
            this.setState({model, modelSync: model});
        }
    }

    getChildContextModel () {
        return this.state.modelSync;
    }

    getModel () {
        return this.state.model;
    }

    reset () {
        super.reset();
        this.setState(() => ({model: {}, modelSync: {}}));
    }

    validate () {
        this.validateModel(this.getChildContextModel());
    }

    onChange (key, value) {
        this.setState(state => ({modelSync: set(cloneDeep(state.modelSync), key, value)}), () => {
            super.onChange(...arguments);
            this.setState({model: this.state.modelSync});
        });
    }
};

export default Auto(ValidatedQuickForm);
