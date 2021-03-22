# Valheim on AWS

An AWS hosted Valheim game server

## Design

Goal: simple / low-cost

### Game Server

Runs on AWS ECS Fargate Spot instances using ephemeral storage.

Game files are re/de-hydrated from S3 on startup/shutdown.

If your spot instance is terminated — it takes about 3 minutes to restore (although I've never had this happen outside of testing), and unfortunately you get a new IP address. You shouldn't lose any data though, as the server performs a graceful shutdown and dehydrates your world onto S3.

### Long-term storage

Version-enabled S3 is used for long-term storage.

Non-current versions are deleted after 10 days.

## Usage

For simplicity, everything assumes `STACK_NAME` is a static value - update as desired:

```shell
export STACK_NAME=pwmcintyre
```

### Deploy

```shell
aws cloudformation deploy \
  --stack-name   \
  --capabilities CAPABILITY_IAM \
  --template-file ./template.yaml
```

### Get the Public IP

Unfortunately a 3 stop process (lambda anyone?)

```shell
TASK_ARN=$(aws ecs list-tasks \
  --cluster ${STACK_NAME} \
  --family ${STACK_NAME} \
    --query 'taskArns[0]' \
    --output text)

TASK_ENI_ID=$(aws ecs describe-tasks \
  --cluster ${STACK_NAME} \
  --task ${TASK_ARN} \
  --query "tasks[0].attachments[0].details[?name=='networkInterfaceId'].value" \
  --output text)

aws ec2 describe-network-interfaces \
  --network-interface-ids ${TASK_ENI_ID} \
  --query 'NetworkInterfaces[0].Association.PublicIp' \
  --output text
```

### Get the Password

```shell
aws secretsmanager get-secret-value --secret-id ${STACK_NAME} --query SecretString --output text
```

### Scale-Down

```shell
aws ecs update-service \
  --cluster ${STACK_NAME} \
  --service ${STACK_NAME} \
  --desired-count 0
```

### Scale-Up

```shell
aws ecs update-service \
  --cluster ${STACK_NAME} \
  --service ${STACK_NAME} \
  --desired-count 1
```

## Pricing

### Host

https://aws.amazon.com/fargate/pricing/

- per vCPU per hour	$0.04856
  - 2 CPU (2048) = 2 * $0.04856 = $0.09712
- per GB per hour	$0.00532
  - 4 Mem (4GB)  = 4 * $0.00532 = $0.02128

```
= 0.1184 per hour
= 2.8416 per day
= 85.248 per month
```

*be sure to scale-down when not in use!*

### Storage

https://aws.amazon.com/s3/pricing/

- First 50 TB / Month	$0.025 per GB
- PUT, COPY, POST, LIST requests (per 1,000 requests)	$0.0055
- GET, SELECT, and all other requests (per 1,000 requests)	$0.00044

```
= $0.25 per month
```

### Secret

https://aws.amazon.com/secrets-manager/pricing/

- $0.40 per secret per month

```
= $0.40 per month
```

## Decision Log

### Q: Hasn't this been done before?

A: Yes and no — I only found solutions using CDK.

CDK is really great if you work in a team who wants to provide abstractions to another team. Eg. Your tooling team wants to make it easy for devs to create company-approved solutions (ie. with the right security features enabled, tagging, etc).

It otherwise adds unnecessary steps.

### Q: Why Fargate?

A: Docker.

This solution leverages a huge amount of work put into the `lloesche/valheim-server-docker` image.

Fargate allows me to deploy that image into AWS without thinking about servers.

### Q: Why Secrets Manager?

A: Best Practice.

Honestly I'm on the fence on this one, you could save $0.40/month by just hard-coding a password into an env var.

🤷

### Q: Why no static IP?

A: Cost.

Although you get 1 complimentary Elastic IP with new AWS accounts, it costs $0.12/day while not in use. That's 43.8/year which I've decided to avoid.

https://aws.amazon.com/ec2/pricing/on-demand/

> To ensure efficient use of Elastic IP addresses, we impose a small hourly charge when these IP addresses are not associated with a running instance or when they are associated with a stopped instance or unattached network interface.

### Q: Why no DNS?

A: Cost.

That's $0.50/month for the Hosted Zone, plus maybe $12/year for a domain.

https://aws.amazon.com/route53/pricing/

## Contribution

I love PR's

## References

- https://github.com/rileydakota/valheim-ecs-fargate-cdk
- https://github.com/lloesche/valheim-server-docker
