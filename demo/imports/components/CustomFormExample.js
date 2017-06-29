import cloneDeep from 'lodash.clonedeep';
import set from 'lodash.set';
import React         from 'react';
import SimpleSchema2    from 'simpl-schema';
import AutoForm from 'uniforms-bootstrap4/AutoForm';
import RadioField from 'uniforms-bootstrap4/RadioField';

const allowedValues = ['on', 'off', 'other'];
const schema = new SimpleSchema2({
    one: {
        type: String,
        defaultValue:  'on',
        allowedValues,
    },
    two: {
        type: String,
        defaultValue:  'off',
        allowedValues,
    },
    three: {
        type: String,
        defaultValue:  'other',
        allowedValues,
    },
});

// example where we know the logic inside onChange and manipulate field by field
class CustomAutoFormIsolated extends AutoForm {
    onChange (key, value) {
        if (this.state.changed !== null && key !== 'three') {
            const model = cloneDeep(super.getModel('form'));
            set(model, key, value); // have to set the changed value here too (setState not done)
            // example where we procedurally replace the model when certain combinations exist
            // no direct access to state, but logic must know field-by-field changes
            if (model.one === 'on' && model.two === 'on') {
                super.onChange('three', 'on');
            }
        }
        super.onChange(key, value);
    }
}


// example where we have a function which transforms the whole model
//   in this case it mutates, but it doesn't have to
const mutateModel = model => {
    if (model.one === 'on' && model.two === 'on') {
        model.three = 'on';
    }
};

class CustomAutoFormWholeReplacement extends AutoForm {
    onChange (key, value) {
        super.onChange(key, value);
        if (this.state.changed !== null && key !== 'three') {
            const model = cloneDeep(this.state.model);
            set(model, key, value); // have to set the changed value here too (setState not done)
            // example where we pass the whole model through a transformer function
            // requires direct state manipulation
            mutateModel(model);
            this.setState({model, modelSync: model});
        }
    }
}

export default class CustomFormExample extends React.Component {
    render () {
        return (
            <div>
                <div style={{float: 'left', width: '50%'}}>
                    <h4>Custom AutoForm: Procedural Change Fields</h4>
                    <CustomAutoFormIsolated schema={schema}>
                        <div style={{float: 'left', width: '30%'}}>
                            <RadioField name="one" />
                        </div>
                        <div style={{float: 'left', width: '30%'}}>
                            <RadioField name="two" />
                        </div>
                        <div style={{float: 'left', width: '30%'}}>
                            <RadioField name="three" />
                        </div>
                        <div style={{clear: 'both'}}></div>
                        <p>When one and two are "on", three should be forced to "on".</p>
                        <p>Otherwise, three can be set to whatever value you like.</p>
                    </CustomAutoFormIsolated>
                </div>
                <div style={{float: 'left', width: '50%'}}>
                    <h4>Custom AutoForm: Wholesale Replace Model after Transform</h4>
                    <CustomAutoFormWholeReplacement schema={schema}>
                        <div style={{float: 'left', width: '30%'}}>
                            <RadioField name="one" />
                        </div>
                        <div style={{float: 'left', width: '30%'}}>
                            <RadioField name="two" />
                        </div>
                        <div style={{float: 'left', width: '30%'}}>
                            <RadioField name="three" />
                        </div>
                        <div style={{clear: 'both'}}></div>
                        <p>When one and two are "on", three should be forced to "on".</p>
                        <p>Otherwise, three can be set to whatever value you like.</p>
                    </CustomAutoFormWholeReplacement>
                </div>
            </div>
        );
    }
}
