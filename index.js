const styles = {
  component: {padding: `0 2rem`},
  h1: {fontSize: `1.5rem`},
  h2: {fontSize: `1rem`, lineHeight: 1, marginBottom: `.8rem`},
  mdlButton: {marginLeft: `1.4rem`},
  mdlMarginBottom: {marginBottom: `1.2rem`}
};

const Find = React.createClass({
  statics: {
    address: code => `https://viacep.com.br/ws/${code}/json/`,
    infosGoogle: address => `https://maps.googleapis.com/maps/api/geocode/json?address=${address}`,
    staticMap: obj => `https://maps.googleapis.com/maps/api/staticmap?center=${[obj.logradouro, obj.localidade, obj.uf].join(`,`)}&markers=icon:http://www.gravatar.com/avatar/e5594b71e9f54f3e73f6294b054f5616|${[obj.location.lat, obj.location.lng].join(`,`)}&scale=false&size=600x300&maptype=roadmap&format=png&visual_refresh=true`
  },
  getInitialState: function () {
    return {address: null, staticmap: null, noResult: null, error: null};
  },
  handleCep: function (e) {
    return this.setState({cep: e.target.value});
  },
  getInfos: function (address) {
    return fetch(Find.infosGoogle([address.logradouro, address.localidade, address.uf].join(`,`)))
      .then(res => res.json())
      .then(res => {
        address.location = res.results[0].geometry.location;
        this.setState({staticmap: Find.staticMap(address)});
      });
  },
  find: function (e) {
    e.preventDefault();

    this.setState(this.getInitialState());

    if (this.state.cep)
      fetch(Find.address(this.state.cep))
      .then(res => res.json())
      .then(res => {
        if (!res.erro) {
          this.setState({address: res});
          this.getInfos(res);
        } else {
          this.setState({noResult: true});
        }
      })
      .catch(() => this.setState({error: true}));
  },
  render: function () {
    return (
      <div>
        <h2 style={styles.h2}>Consultar</h2>
        <form onSubmit={this.find}>
          <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
            <input onChange={this.handleCep} className="mdl-textfield__input" type="text" id="cep" maxLength="9" />
            <label className="mdl-textfield__label" for="cep">CEP</label>
          </div>
          <button type="submit" style={styles.mdlButton} className="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent">Buscar</button>
        </form>

        {this.state.address ? 
          <div style={styles.mdlMarginBottom}>
            <b>{this.state.address.logradouro}</b><br />
            {this.state.address.bairro}<br />
            {this.state.address.localidade}-{this.state.address.uf}<br />
            {this.state.address.cep}
          </div>
        : null }
        {this.state.staticmap ? <img src={this.state.staticmap} /> : null }
        {this.state.noResult ? <p>Nenhum endereço encontrado.</p> : null}
        {this.state.error ? <p>Digite um CEP válido.</p> : null}
      </div>
    );
  }
});

document.body.appendChild(document.createElement(`main`));
ReactDOM.render((
  <section style={styles.component}> 
    <h1 style={styles.h1}>Consulta de endereço</h1>
    <Find />
  </section>
), document.querySelector(`main`));