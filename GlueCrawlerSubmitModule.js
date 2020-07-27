/*
処理固有に必要な処理などを、この層に実装する。

テストや挙動確認を含めたコードをコメントアウト込みで、
サンプルとして記述する。

written by syo
http://awsblog.physalisgp02.com
*/
module.exports = function GlueCrawlerSubmitModule() {
  // 疑似的な継承関係として親モジュールを読み込む
  var superClazzFunc = new require("./AbstractGlueBizCommon.js");
  // prototypeにセットする事で継承関係のように挙動させる
  GlueCrawlerSubmitModule.prototype = new superClazzFunc();

  // 処理の実行
  function* execute(event, context, bizRequireObjects) {
    var base = GlueCrawlerSubmitModule.prototype.AbstractBaseCommon;
    try {
      base.writeLogTrace("GlueCrawlerSubmitModule# execute : start");

      // 親の業務処理を実行
      return yield GlueCrawlerSubmitModule.prototype.executeBizUnitCommon(
        event,
        context,
        bizRequireObjects
      );
    } catch (err) {
      base.printStackTrace(err);
      throw err;
    } finally {
      base.writeLogTrace("GlueCrawlerSubmitModule# execute : end");
    }
  }

  /*
  業務メイン処理（オーバーライドのサンプル）

  @override
  @param args 各処理の結果を格納した配列
  */
  GlueCrawlerSubmitModule.prototype.AbstractBaseCommon.businessMainExecute = function (
    args
  ) {
    var base = GlueCrawlerSubmitModule.prototype.AbstractBaseCommon;
    try {
      base.writeLogTrace(
        "GlueCrawlerSubmitModule# businessMainExecute : start"
      );

      // 基底処理を実行する事で、Lambda実行引数のeventを取り出せる
      var event = base.getFirstIndexObject(args);

      var targetCrawlerName = base.getTargetCrawlerName();

      var param = {
        Name: targetCrawlerName,
      };

      // Promiseを戻す関数として実装可能
      return new Promise(function (resolve, reject) {
        base.RequireObjects.Glue.startCrawler(param, function (err, data) {
          if (err) {
            base.printStackTrace(err);
            reject(err);
          } else {
            resolve(data);
          }
        });
      });
    } catch (err) {
      base.printStackTrace(err);
      throw err;
    } finally {
      base.writeLogTrace("GlueCrawlerSubmitModule# businessMainExecute : end");
    }
  }.bind(GlueCrawlerSubmitModule.prototype.AbstractBaseCommon);

  /*
  順次処理する関数を指定する。
  Promiseを返却すると、Promiseの終了を待った上で順次処理をする
  
  前処理として、initEventParameterを追加

  @param event Lambdaの起動引数：event
  @param context Lambdaの起動引数：context
  */
  GlueCrawlerSubmitModule.prototype.AbstractBaseCommon.getTasks = function (
    event,
    context
  ) {
    var base = GlueCrawlerSubmitModule.prototype.AbstractBaseCommon;
    try {
      base.writeLogTrace("GlueCrawlerSubmitModule# getTasks :start");

      return [this.beforeMainExecute, this.businessMainExecute];
    } catch (err) {
      base.printStackTrace(err);
      throw err;
    } finally {
      base.writeLogTrace("GlueCrawlerSubmitModule# getTasks :end");
    }
  };

  return {
    execute,
  };
};
