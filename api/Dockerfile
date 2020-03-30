FROM ruby:2.7.0-alpine

RUN apk --update add bash less git tzdata
RUN apk --update add build-base libxml2-dev libxslt-dev # Nokogiri

WORKDIR /usr/src/app
COPY Gemfile Gemfile
COPY Gemfile.lock Gemfile.lock
RUN bundle install

COPY . .
CMD ["rails", "s", "-b", "0.0.0.0"]
