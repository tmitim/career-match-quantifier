/* src/content.js */
import React from 'react';
import ReactDOM from 'react-dom';
import "./content.css";
import skills from "./skills";
/*global chrome*/

// chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
//   alert('updated from contentscript');
// });
const styles = {
  score: {
    paddingBottom: '10px',
  },
  hitmiss: {
    color: 'green',
  }
};

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hidden: false,
    }

    this.handleMessage = this.handleMessage.bind(this);
  }
  componentDidMount() {
    // Add listener when component mounts
    chrome.runtime.onMessage.addListener(this.handleMessage);
  }

  componentWillUnmount() {
   // Remove listener when this component unmounts
   chrome.runtime.onMessage.removeListener(this.handleMessage);
  }

  handleMessage(request) {
    if (request.message === 'hello!') {
      console.log('xxxxx', request.url) // new url is now in content scripts!
      this.setState({
        hidden: !request.url.startsWith('https://www.linkedin.com/jobs/view/'),
      });
      console.log('this.state', this.state);
    }
  }

  render() {

    const t = document.getElementById('job-details');
    if (!t) {
      return (
        <div className={'my-extension-empty'}>
        </div>
      );
    }
    let ul = t.getElementsByTagName('ul') || [];
    console.log('ull', ul);
    let li = [];
    let hit = 0;
    let miss = 0;
    for (let item of ul) {
      let lines = item.getElementsByTagName('li');
      let blockHit = 0;
      let blockMiss = 0;

      for (var i = 0; i < lines.length; i++) {
        console.log(lines[i].innerText);
        if (skills.some((skill) => lines[i].innerText.toLowerCase().replace(/\W/g, ' ').split(' ').includes(skill))) {
          blockHit += 1;
        } else {
          blockMiss += 1;
        }
        li.push(lines[i].innerText);
      }
      if (blockHit > 0) {
        hit += blockHit;
        miss += blockHit + blockMiss;
      }
    };

    console.log({
      hit,
      miss
    })

    let list = li.map(l => {
      if (skills.some(skill => l.toLowerCase().replace(/\W/g, ' ').split(' ').includes(skill))) {
      // if (l.split(' ').some(r => skills.map(a => a.toLowerCase().includes(r.toLowerCase())))) {
        return <li>{String.fromCharCode('10004')} {l}</li>
      } else {
        return <li>{String.fromCharCode('10079')} {l}</li>
      }
    });

    list = (<ul>{list}</ul>)

    let jobScore;
    if (hit > 0) {
      jobScore =
      <div>
        Job Score: <span style={styles.hitmiss}>{((hit/miss) * 10).toFixed(1)}</span> / 10
      </div>
    } else {
      jobScore = <div>Job Score: It seems you're not compatible with this job</div>

    }

    if (!li.length) {
      list = <div>Unfortunately, this job listing is not compatible with the your job score</div>
    }

    console.log('chrome', chrome);
    console.log('tabs', chrome.tabs);
    console.log('list', list)
    console.log('li', li)

    let container = <div></div>
    if (!this.state.hidden) {
      console.log('not hidden');
      container = (
      <div className={'my-extension'}>
        <h3>Career Match Quantifier</h3>
        <div style={styles.score}>{jobScore}</div>
        <h3>Job Highlights</h3>
        <div>{list}</div>
      </div>
      )
    }

    return (
      <div>{container}</div>
    )
  }
}

const app = document.createElement('div');
app.id = "my-extension-root";
document.body.appendChild(app);
ReactDOM.render(<Main />, app);
