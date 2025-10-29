import bcrypt

def get_hashed_password(input_password):
  hash = bcrypt.hashpw(input_password.encode('utf-8'), bcrypt.gensalt())
  return hash.decode("utf-8")

def check_password(hashed_password, input_password):
  return bcrypt.checkpw(input_password.encode('utf-8'), hashed_password.encode('utf-8'))