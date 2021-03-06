import React, { useState, useEffect, useContext } from 'react';
import { Input, Select, Tooltip } from 'antd';

import { Context } from '../../../store/neutron1';
import BaseComponent from '../BaseComponent';
import socket from '../../../socket';

const ws = socket('query', '/command/');

/**
 * Send commands to agents. Simulates a CLI.
 */
const Commands = React.memo(() => {
  /** Agents */
  const [agentList, setAgentList] = useState([]);
  /** Selected agent to get requests from */
  const [selectedAgent, setSelectedAgent] = useState([]);
  /** Requests possible from selectedAgent */
  const [agentRequests, setAgentRequests] = useState([]);
  /** Selected agent request */
  const [selectedRequest, setSelectedRequest] = useState('> agent');
  /** Agent command arguments */
  const [commandArguments, setCommandArguments] = useState('');
  /** Agent command history (to display in the terminal) */
  const [commandHistory, setCommandHistory] = useState([]);

  /** Manages requests for agent list and agent [node] [process] */
  ws.onmessage = ({ data }) => {
    let json;

    try {
      json = JSON.parse(data);
    } catch (err) {
      // console.log(err);
    }

    if (json && json.output && json.output.requests) {
      // agent node proc
      setAgentRequests(json.output.requests);
    } else if (json && json.output) {
      // agent node proc cmd
      setCommandHistory([...commandHistory, json.output]);
    }
  };


  const { state } = useContext(Context);

  useEffect(() => {
    if (state.list) {
      setAgentList(state.list.agent_list);
    }
  }, [state.list]);

  /** Close ws on unmount */
  useEffect(() => () => ws.close(), []);

  /** Handle submission of agent command */
  const sendCommand = () => {
    if (selectedRequest === '> agent') {
      ws.send(commandArguments);
      setCommandHistory([...commandHistory, `➜ agent ${commandArguments}`]);
    } else {
      ws.send(`${selectedAgent[0]} ${selectedAgent[1]} ${selectedRequest} ${commandArguments}`);
      setCommandHistory([...commandHistory, `➜ agent ${selectedAgent[0]} ${selectedAgent[1]} ${selectedRequest} ${commandArguments}`]);
    }
  };

  /** Get the possible requests for selected agent */
  const getRequests = () => {
    if (selectedAgent.length > 0) {
      ws.send(`${selectedAgent[0]} ${selectedAgent[1]} help_json`);
    }
  };

  /** Watches for changes to selectedAgent. Then sends WS message to get list of commands. */
  useEffect(() => {
    getRequests();
  }, [selectedAgent]);

  return (
    <BaseComponent
      name="Agent Commands"
      subheader=""
      liveOnly
      showStatus={false}
    >
      <Select
        className="w-full mb-2"
        dropdownMatchSelectWidth={false}
        onChange={(value) => {
          setAgentRequests([]);
          setSelectedAgent(value.split(':'));
        }}
        placeholder="Select agent node and process"
      >
        {
          agentList.map(({ agent }) => (
            <Select.Option
              key={agent}
              value={agent}
            >
              {agent}
            </Select.Option>
          ))
        }
      </Select>
      <div className="border border-gray-300 rounded mb-2 p-4 bg-white font-mono h-32 max-h-full resize-y overflow-y-scroll">
        {
          // eslint-disable-next-line
          commandHistory.map((command, i) => (<div key={i}>{ command }</div>))
        }
      </div>
      <div className="flex">
        <Input
          addonBefore={(
            <Select
              className="w-auto"
              defaultValue="> agent"
              dropdownMatchSelectWidth={false}
              onChange={value => setSelectedRequest(value)}
            >
              <Select.Option value="> agent">
                <Tooltip placement="topLeft" title="node process [arguments]">
                  ➜ agent
                </Tooltip>
              </Select.Option>
              {
                agentRequests.map(({ token, synopsis, description }) => (
                  <Select.Option value={token} key={token}>
                    <Tooltip placement="topLeft" title={`${synopsis ? `${synopsis} ` : ''}${description}`}>
                      { token }
                    </Tooltip>
                  </Select.Option>
                ))
              }
            </Select>
          )}
          addonAfter={(
            <div
              className="cursor-pointer text-blue-600 hover:text-blue-400"
              onClick={() => {
                sendCommand();
                setCommandArguments('');
              }}
              onKeyDown={() => {}}
              role="button"
              tabIndex={0}
            >
              Send
            </div>
          )}
          placeholder="Arguments"
          onChange={({ target: { value } }) => setCommandArguments(value)}
          onPressEnter={() => {
            sendCommand();
            setCommandArguments('');
          }}
          value={commandArguments}
        />
      </div>
    </BaseComponent>
  );
});

export default Commands;
