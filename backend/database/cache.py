import redis


redis_client = redis.StrictRedis(
	host='frankfurt-redis.render.com',
	port=6379,
	username='red-ck2cph36fquc73bidffg',
	password='1MioVK3lAGo7vvIkTx2IKsTSIJCGkvKq',
	ssl=True,
	ssl_cert_reqs=None
)

def set_message_read_status(message_id, is_read):
    # status read in Redis
    redis_client.set(f'message_{message_id}_read_status', str(is_read))

def get_message_read_status(message_id):
    # get status dead message from Redis
    status = redis_client.get(f'message_{message_id}_read_status')
    return status.decode() if status else None
