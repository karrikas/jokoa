<?php
namespace App;
use Ratchet\MessageComponentInterface;
use Ratchet\ConnectionInterface;
use Monolog\Logger;
use Monolog\Handler\StreamHandler;

class JokoMahia implements MessageComponentInterface
{
    protected $clients;
    protected $log;

    protected $names;
    protected $roons;

    public function __construct()
    {
        $this->clients = new \SplObjectStorage;
        $log = new Logger('jokomahia');
        $log->pushHandler(new StreamHandler('var/global.log', Logger::DEBUG));
        $this->log = $log;
    }

    public function onOpen(ConnectionInterface $conn)
    {
        $this->clients->attach($conn);
        $this->log->debug('id', [$conn->resourceId]);
    }

    public function onMessage(ConnectionInterface $from, $msg)
    {
        $this->log->debug('message', [$msg]);
        $this->log->debug('from', [$from->resourceId]);
        $data = json_decode($msg);
        if ($data->action) {
          $this->{'action'.$data->action}($from, $data->data);
        }

        //$client->send($msg);
    }

    protected function actionGetUsersList($roon)
    {
      $list = [];
      foreach ($this->roons[$roon] as $client) {
        $list[] = $this->names[$client->resourceId];
      }

      return $list;
    }

    protected function actionSendUsersList($roon)
    {
      foreach ($this->roons[$roon] as $client) {
        $return = [
          'name' => 'UserList',
          'data' => ['list' => $this->actionGetUsersList($roon)]
        ];
        $client->send(json_encode($return));
      }
    }

    protected function actionRoonCreate($from, $data)
    {
      $id = $from->resourceId;
      $this->roons[$data->roon] = [$from];

      $this->actionSendUsersList($data->roon);

      $this->log->debug('roons', [$this->roons]);
    }

    protected function actionAdd2roon($from, $data)
    {
      $id = $from->resourceId;
      $this->roons[$data->roon][] = $from;

      $this->log->debug('roons', [$this->roons]);
    }

    protected function actionSetName($from, $data)
    {
      $this->log->debug('actionSetName', [$data->name]);
      $this->names[$from->resourceId] = $data->name;
    }

    public function onClose(ConnectionInterface $conn)
    {
        $this->clients->detach($conn);
    }

    public function onError(ConnectionInterface $conn, \Exception $e)
    {
        $conn->close();
    }
}
